import axiosInstance from '@/lib/axios';

export interface TokenBalanceResponse {
  status: string;
  balance: number;
  recentUsage?: any[];
}

export interface TokenPackage {
  tokens: number;
  price: number;
  bonus: number;
  total_tokens: number;
  effective_rate: number;
}

export interface TokenPackagesResponse {
  status: string;
  packages: TokenPackage[];
}

export interface TokenPurchaseResponse {
  status: string;
  message: string;
  paymentLink?: string;
  transactionReference?: string;
  totalTokens?: number;
  bonusTokens?: number;
}

export interface TokenUsageRecord {
  model: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  openaiCostUsd: number;
  platformFeeUsd: number;
  totalCostUsd: number;
  totalCostNgn: number;
  tokensDeducted: number;
  requestType: string;
  status: string;
  createdAt: string;
}

export interface TokenUsageHistoryResponse {
  status: string;
  usageHistory: TokenUsageRecord[];
  totals: {
    totalTokensUsed: number;
    totalCostNgn: number;
    totalRequests: number;
  };
}

export const aiTokenService = {
  // Get user's token balance
  getBalance: async (): Promise<TokenBalanceResponse> => {
    const response = await axiosInstance.get('/api/ai-token/balance');
    return response.data;
  },

  // Get available token packages
  getPackages: async (): Promise<TokenPackagesResponse> => {
    const response = await axiosInstance.get('/api/ai-token/packages');
    return response.data;
  },

  // Create token purchase
  createPurchase: async (data: {
    tokens: number;
    amount: number;
    email?: string;
    name?: string;
  }): Promise<TokenPurchaseResponse> => {
    const response = await axiosInstance.post('/api/ai-token/purchase', data);
    return response.data;
  },

  // Verify token purchase (Flutterwave callback)
  verifyPurchase: async (tx_ref: string, transaction_id: string): Promise<any> => {
    const response = await axiosInstance.get('/api/ai-token/verify', {
      params: { tx_ref, transaction_id }
    });
    return response.data;
  },

  // Record token usage after AI response
  recordUsage: async (data: {
    model: string;
    inputTokens: number;
    outputTokens: number;
    cachedTokens?: number;
    cacheWriteTokens?: number;
    reasoningTokens?: number;
    requestType?: 'chat' | 'code_analysis' | 'file_analysis' | 'voice' | 'other';
  }): Promise<any> => {
    const response = await axiosInstance.post('/api/ai-token/usage', data);
    return response.data;
  },

  // Get token usage history
  getUsageHistory: async (): Promise<TokenUsageHistoryResponse> => {
    const response = await axiosInstance.get('/api/ai-token/history');
    return response.data;
  }
};