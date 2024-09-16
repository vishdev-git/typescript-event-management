import { SignupRequest, LoginRequest, SignupResponse, LoginResponse } from '../models/Student';
import EventModel from '../models/Event';

export interface IUserService {
    signup(request: SignupRequest): Promise<SignupResponse>;
    login(request: LoginRequest): Promise<LoginResponse>;
    fetchEvents(userId: number): Promise<{ allEvents: EventModel[], joinedEvents: EventModel[] }>;
    joinEvent(userId: number, eventId: number): Promise<void>; 
    unjoinEvent(userId: number, eventId: number): Promise<void>; 
}