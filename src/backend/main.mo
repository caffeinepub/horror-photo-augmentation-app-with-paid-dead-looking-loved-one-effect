import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Storage "blob-storage/Storage";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  public type UserProfile = {
    name : Text;
    hasPaidTier : Bool;
  };

  public type PhotoProject = {
    id : Text;
    title : Text;
    baseImage : Storage.ExternalBlob;
    effectLayers : [EffectLayer];
    creator : Principal;
  };

  public type EffectLayer = {
    name : Text;
    intensity : Nat;
    config : Text;
  };

  let photoProjects = Map.empty<Text, PhotoProject>();
  let userProjects = Map.empty<Principal, [Text]>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Paid Tier Management
  public shared ({ caller }) func upgradeToPaidTier() : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can upgrade to paid tier");
    };

    let currentProfile = switch (userProfiles.get(caller)) {
      case (null) {
        { name = ""; hasPaidTier = false };
      };
      case (?profile) { profile };
    };

    let updatedProfile = {
      name = currentProfile.name;
      hasPaidTier = true;
    };
    userProfiles.add(caller, updatedProfile);
  };

  public query ({ caller }) func hasPaidAccess() : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      return false;
    };

    switch (userProfiles.get(caller)) {
      case (null) { false };
      case (?profile) { profile.hasPaidTier };
    };
  };

  // Project Management
  public shared ({ caller }) func saveProject(project : PhotoProject) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save projects");
    };

    // Verify ownership: caller must be the creator
    if (project.creator != caller) {
      Runtime.trap("Unauthorized: Cannot save project for another user");
    };

    // Check if project contains paid effects
    let containsPaidEffect = project.effectLayers.any(
      func(layer) { layer.name == "dead-looking loved one" }
    );

    if (containsPaidEffect) {
      let hasPaid = switch (userProfiles.get(caller)) {
        case (null) { false };
        case (?profile) { profile.hasPaidTier };
      };

      if (not hasPaid) {
        Runtime.trap("Unauthorized: Paid tier required to save projects with premium effects");
      };
    };

    photoProjects.add(project.id, project);

    let newIds = switch (userProjects.get(caller)) {
      case (null) { [project.id] };
      case (?ids) { ids.concat([project.id]) };
    };
    userProjects.add(caller, newIds);
  };

  public query ({ caller }) func listUserProjects() : async [PhotoProject] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can list projects");
    };

    switch (userProjects.get(caller)) {
      case (null) { [] };
      case (?projectIds) {
        let projects = projectIds.map(
          func(id) {
            switch (photoProjects.get(id)) {
              case (null) { null };
              case (?project) { ?project };
            };
          }
        );
        projects.filter(
          func(project) { switch (project) { case (null) { false }; case (_) { true } } }
        ).map(
          func(project) {
            switch (project) {
              case (null) {
                Runtime.trap("This should never happen since nulls are filtered out");
              };
              case (?project) { project };
            };
          }
        );
      };
    };
  };

  public query ({ caller }) func getProject(projectId : Text) : async PhotoProject {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access projects");
    };

    switch (photoProjects.get(projectId)) {
      case (null) { Runtime.trap("Project not found") };
      case (?project) {
        // Verify ownership: only creator or admin can access
        if (project.creator != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only access your own projects");
        };
        project;
      };
    };
  };

  public shared ({ caller }) func deleteProject(projectId : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can delete projects");
    };

    switch (photoProjects.get(projectId)) {
      case (null) { Runtime.trap("Project not found") };
      case (?project) {
        // Verify ownership: only creator or admin can delete
        if (project.creator != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only delete your own projects");
        };

        photoProjects.remove(projectId);

        // Remove from user's project list
        switch (userProjects.get(project.creator)) {
          case (null) {};
          case (?projectIds) {
            let filtered = projectIds.filter(func(id) { id != projectId });
            userProjects.add(project.creator, filtered);
          };
        };
      };
    };
  };

  // Admin function to grant paid tier
  public shared ({ caller }) func grantPaidTier(user : Principal) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can grant paid tier");
    };

    let currentProfile = switch (userProfiles.get(user)) {
      case (null) {
        { name = ""; hasPaidTier = false };
      };
      case (?profile) { profile };
    };

    let updatedProfile = {
      name = currentProfile.name;
      hasPaidTier = true;
    };
    userProfiles.add(user, updatedProfile);
  };
};
