// Affiliate Service
import axiosInstance from '../lib/axios';

export interface AffiliateStats {
    affiliate_id: string | null;
    isActive: boolean;
    affiliate_money: number;
    totalEarnings: number;
    pendingBalance: number;
    withdrawnAmount: number;
    totalClicks: number;
    totalSignups: number;
    paidEnrollments: number;
    currentBalance: number;
}

export interface Referral {
    avatar: string;
    name: string;
    course: string;
    earnings: string;
    status: 'Enrolled' | 'Pending';
}

export const affiliateService = {
    // Get affiliate statistics
    async getStats(): Promise<{ status: string; message: string; stats: AffiliateStats }> {
        const res = await axiosInstance.post('/api/affiliate/stats');
        return res.data;
    },

    // Get recent referrals
    async getRecentReferrals(): Promise<{ status: string; message: string; referrals: Referral[] }> {
        const res = await axiosInstance.get('/api/affiliate/referrals');
        return res.data;
    },

    // Get affiliate status
    async getStatus(userType: 'user' | 'instructor'): Promise<{ status: string; message: string; affiliate: any }> {
        const res = await axiosInstance.get('/api/affiliate/status', { params: { userType } });
        return res.data;
    },

    // Activate affiliate account
    async activate(userType: 'user' | 'instructor'): Promise<{ status: string; message: string; affiliate: any }> {
        const res = await axiosInstance.post('/api/affiliate/activate', { userType });
        return res.data;
    },

    // Generate affiliate link for a course
    async generateLink(courseId: string): Promise<{ status: string; message: string; affiliateLink: string }> {
        const res = await axiosInstance.post('/api/affiliate/generate-link', { courseId });
        return res.data;
    },

    // Create withdrawal request
    async createWithdrawal(data: {
        amount: number;
        bankName: string;
        accountNumber: string;
        accountName: string;
    }): Promise<{ status: string; message: string; withdrawal?: any }> {
        const res = await axiosInstance.post('/api/affiliate/withdrawal', data);
        return res.data;
    },

    // Get withdrawal history
    async getWithdrawals(): Promise<{ status: string; message: string; withdrawals: any[] }> {
        const res = await axiosInstance.get('/api/affiliate/withdrawals');
        return res.data;
    },

    // Get bank list from Flutterwave
    async getBanks(): Promise<{ status: string; message: string; banks: any[] }> {
        const res = await axiosInstance.get('/api/affiliate/banks');
        return res.data;
    },
};
