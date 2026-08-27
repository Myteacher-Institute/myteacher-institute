// Mentorship Service
import axiosInstance from '../lib/axios';

export interface Mentor {
  _id: string;
  name: string;
  profilePicture: string;
  specialization: string;
  bio?: string;
  mentorshipBio?: string;
  mentorshipPrice?: number;
  expertise?: string[];
}

export interface MentorshipRequestPayload {
  instructorId: string;
  skillCategory: string;
  learningGoal: string;
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  mentorshipType: 'Private' | 'Group';
  budgetRange?: string;
  availability?: string;
  additionalNotes?: string;
}

export interface InstructorMentorRequest {
  _id: string;
  studentId: {
    _id: string;
    name: string;
    email: string;
    profilePicture?: string;
  };
  skillCategory: string;
  learningGoal: string;
  skillLevel: string;
  mentorshipType: string;
  budgetRange?: string;
  availability?: string;
  additionalNotes?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'paid' | 'active';
  availableTime?: string;
  programDuration?: string;
  paymentStatus?: 'pending' | 'successful' | 'failed' | 'cancelled';
  amountPaid?: number;
  createdAt: string;
}

// Populated instructor on a student's pending request
export interface PendingInstructorInfo {
  _id: string;
  name: string;
  email?: string;
  profilePicture?: string;
  specialization?: string;
  mentorshipPrice?: number;
}

export type StudentPendingRequest = InstructorMentorRequest & {
  instructorId: PendingInstructorInfo;
};

export interface StudentMentorship {
  requestId: string;
  status: string;
  skillCategory?: string;
  mentorshipType?: string;
  programDuration?: string;
  programEndDate?: string;
  mentor: {
    _id: string;
    name: string;
    profilePicture: string;
    specialization: string;
    mentorshipBio?: string;
    whatsappNumber?: string;
    whatsappLink?: string;
    mentorshipPrice?: number;
  };
  amountPaid?: number;
  createdAt: string;
}

export const mentorService = {
  // Public list of available mentors (?limit=3 for landing mini cards)
  async getMentors(limit?: number): Promise<{ status: string; mentors: Mentor[]; total: number }> {
    const res = await axiosInstance.get('/api/mentor', { params: limit ? { limit } : undefined });
    return res.data;
  },

  // Student requests a specific mentor
  async requestMentorship(payload: MentorshipRequestPayload): Promise<{ status: string; message: string }> {
    const res = await axiosInstance.post('/api/mentor/request', payload);
    return res.data;
  },

  // Current instructor's mentorship activation status
  async getMentorStatus(): Promise<{
    status: string;
    isMentor: boolean;
    mentorProfile?: {
      name: string;
      email: string;
      profilePicture: string;
      specialization: string;
      mentorshipBio?: string;
      whatsappNumber?: string;
      mentorshipPrice?: number;
    };
  }> {
    const res = await axiosInstance.get('/api/mentor/status');
    return res.data;
  },

  // Instructor activates/deactivates mentorship (validates WhatsApp number)
  async becomeMentor(params: {
    isMentor: boolean;
    whatsappNumber?: string;
    mentorshipBio?: string;
    mentorshipPrice?: number;
  }): Promise<{
    status: string;
    message: string;
    instructor?: {
      isMentor: boolean;
      whatsappNumber?: string;
      mentorshipPrice?: number;
      mentorshipBio?: string;
    };
  }> {
    const res = await axiosInstance.patch('/api/mentor/become', params);
    return res.data;
  },

  // Instructor's incoming mentorship requests
  async getMentorRequests(): Promise<{ status: string; requests: InstructorMentorRequest[] }> {
    const res = await axiosInstance.get('/api/mentor/requests');
    return res.data;
  },

  async acceptMentorRequest(
    requestId: string,
    data: { availableTime: string; programDuration: string }
  ): Promise<{ status: string; message: string }> {
    const res = await axiosInstance.patch(`/api/mentor/requests/${requestId}/accept`, data);
    return res.data;
  },

  async rejectMentorRequest(requestId: string): Promise<{ status: string; message: string }> {
    const res = await axiosInstance.patch(`/api/mentor/requests/${requestId}/reject`);
    return res.data;
  },

  // Student re-initiates payment for an accepted request (fresh Flutterwave link)
  async createMentorshipPayment(requestId: string): Promise<{ status: string; message: string; paymentLink?: string; transactionReference?: string }> {
    const res = await axiosInstance.post(`/api/mentor/requests/${requestId}/pay`);
    return res.data;
  },

  // Student's active mentorships + pending requests
  async getMyMentorships(): Promise<{
    status: string;
    message?: string;
    mentorships: StudentMentorship[];
    pendingRequests: StudentPendingRequest[];
  }> {
    const res = await axiosInstance.get('/api/student/mentorship');
    return res.data;
  },
};
