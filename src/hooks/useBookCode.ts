import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface CodeInfo {
  code: string;
  edition: string;
  redeemed_at: string;
}

interface RedeemResult {
  success: boolean;
  message: string;
  codeInfo?: CodeInfo;
}

export function useBookCode() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const redeemCode = async (code: string): Promise<RedeemResult> => {
    if (!user) {
      return { success: false, message: 'Not authenticated' };
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .rpc('redeem_book_code', { _code: code.toUpperCase().trim() });

      if (error) {
        console.error('Redeem error:', error);
        return { success: false, message: 'Failed to redeem code. Please try again.' };
      }

      const result = data?.[0];
      if (!result) {
        return { success: false, message: 'Invalid response from server' };
      }

      let codeInfo: CodeInfo | undefined;
      if (result.code_info && typeof result.code_info === 'object' && !Array.isArray(result.code_info)) {
        const info = result.code_info as Record<string, unknown>;
        codeInfo = {
          code: String(info.code || ''),
          edition: String(info.edition || ''),
          redeemed_at: String(info.redeemed_at || ''),
        };
      }

      return {
        success: result.success,
        message: result.message,
        codeInfo,
      };
    } catch (err) {
      console.error('Redeem exception:', err);
      return { success: false, message: 'An error occurred. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  const validateCodeFormat = (code: string): boolean => {
    // Format: FT-XXXXXX (letters and numbers)
    const pattern = /^FT-[A-Z0-9]{6}$/i;
    return pattern.test(code.trim());
  };

  const formatCodeInput = (input: string): string => {
    // Remove non-alphanumeric except hyphen
    let cleaned = input.toUpperCase().replace(/[^A-Z0-9-]/g, '');
    
    // Auto-add FT- prefix if user starts typing without it
    if (cleaned.length > 0 && !cleaned.startsWith('FT-')) {
      if (cleaned.startsWith('FT')) {
        cleaned = 'FT-' + cleaned.slice(2);
      } else {
        cleaned = 'FT-' + cleaned;
      }
    }
    
    // Limit length (FT- + 6 chars = 9)
    return cleaned.slice(0, 9);
  };

  return {
    redeemCode,
    validateCodeFormat,
    formatCodeInput,
    loading,
  };
}
