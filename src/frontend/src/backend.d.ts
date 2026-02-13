import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface EffectLayer {
    name: string;
    config: string;
    intensity: bigint;
}
export interface PhotoProject {
    id: string;
    title: string;
    creator: Principal;
    effectLayers: Array<EffectLayer>;
    baseImage: ExternalBlob;
}
export interface UserProfile {
    name: string;
    hasPaidTier: boolean;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteProject(projectId: string): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getProject(projectId: string): Promise<PhotoProject>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    grantPaidTier(user: Principal): Promise<void>;
    hasPaidAccess(): Promise<boolean>;
    isCallerAdmin(): Promise<boolean>;
    listUserProjects(): Promise<Array<PhotoProject>>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveProject(project: PhotoProject): Promise<void>;
    upgradeToPaidTier(): Promise<void>;
}
