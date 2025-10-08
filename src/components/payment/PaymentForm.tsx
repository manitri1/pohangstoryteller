'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  CreditCard,
  Smartphone,
  Banknote,
  Shield,
  Check,
  X,
  Lock,
  Calendar,
  User,
  MapPin,
  Phone,
  Mail,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const paymentSchema = z.object({
  paymentMethod: z.enum(['card', 'kakao', 'naver', 'bank']),
  cardNumber: z.string().optional(),
  expiryDate: z.string().optional(),
  cvv: z.string().optional(),
  cardHolderName: z.string().optional(),
  phoneNumber: z.string().optional(),
  bankCode: z.string().optional(),
  accountNumber: z.string().optional(),
  agreeToTerms: z
    .boolean()
    .refine((val) => val === true, '약관에 동의해야 합니다.'),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface PaymentFormProps {
  orderItems: OrderItem[];
  totalAmount: number;
  onPaymentSuccess?: (paymentData: any) => void;
  onPaymentCancel?: () => void;
}

export default function PaymentForm({
  orderItems,
  totalAmount,
  onPaymentSuccess,
  onPaymentCancel,
}: PaymentFormProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string>('card');

  const form = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      paymentMethod: 'card',
      agreeToTerms: false,
    },
  });

  const paymentMethods = [
    {
      id: 'card',
      name: '신용카드',
      icon: <CreditCard className="h-5 w-5" />,
      description: 'VISA, MasterCard, AMEX',
    },
    {
      id: 'kakao',
      name: '카카오페이',
      icon: <Smartphone className="h-5 w-5" />,
      description: '간편결제',
    },
    {
      id: 'naver',
      name: '네이버페이',
      icon: <Smartphone className="h-5 w-5" />,
      description: '간편결제',
    },
    {
      id: 'bank',
      name: '계좌이체',
      icon: <Banknote className="h-5 w-5" />,
      description: '실시간 계좌이체',
    },
  ];

  const banks = [
    { code: '001', name: '국민은행' },
    { code: '002', name: '우리은행' },
    { code: '003', name: '신한은행' },
    { code: '004', name: '하나은행' },
    { code: '005', name: '농협은행' },
    { code: '006', name: '기업은행' },
    { code: '007', name: 'SC제일은행' },
    { code: '008', name: '한국씨티은행' },
  ];

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handlePayment = async (data: PaymentFormData) => {
    try {
      setIsProcessing(true);

      // 결제 처리 시뮬레이션
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // 결제 성공
      const paymentData = {
        orderId: `order-${Date.now()}`,
        paymentMethod: data.paymentMethod,
        amount: totalAmount,
        status: 'completed',
        transactionId: `txn-${Date.now()}`,
        timestamp: new Date(),
      };

      toast({
        title: '결제 완료',
        description: '주문이 성공적으로 처리되었습니다.',
      });

      onPaymentSuccess?.(paymentData);
    } catch (error) {
      console.error('결제 처리 실패:', error);
      toast({
        title: '결제 실패',
        description: '결제 처리 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
    }).format(price);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 주문 요약 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            주문 요약
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {orderItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {item.image && (
                  <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div>
                  <h4 className="font-medium">{item.name}</h4>
                  <p className="text-sm text-gray-500">
                    수량: {item.quantity}개
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            </div>
          ))}
          <Separator />
          <div className="flex items-center justify-between text-lg font-bold">
            <span>총 결제금액</span>
            <span className="text-blue-600">{formatPrice(totalAmount)}</span>
          </div>
        </CardContent>
      </Card>

      {/* 결제 방법 선택 */}
      <Card>
        <CardHeader>
          <CardTitle>결제 방법</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {paymentMethods.map((method) => (
              <Button
                key={method.id}
                variant={selectedMethod === method.id ? 'default' : 'outline'}
                className="flex flex-col items-center gap-2 h-auto p-4"
                onClick={() => {
                  setSelectedMethod(method.id);
                  form.setValue('paymentMethod', method.id as any);
                }}
              >
                {method.icon}
                <div className="text-center">
                  <div className="font-medium">{method.name}</div>
                  <div className="text-xs text-gray-500">
                    {method.description}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 결제 정보 입력 */}
      <Card>
        <CardHeader>
          <CardTitle>결제 정보</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handlePayment)}
              className="space-y-6"
            >
              {/* 신용카드 정보 */}
              {selectedMethod === 'card' && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cardNumber">카드 번호</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={form.watch('cardNumber') || ''}
                      onChange={(e) => {
                        const formatted = formatCardNumber(e.target.value);
                        form.setValue('cardNumber', formatted);
                      }}
                      maxLength={19}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiryDate">만료일</Label>
                      <Input
                        id="expiryDate"
                        placeholder="MM/YY"
                        value={form.watch('expiryDate') || ''}
                        onChange={(e) => {
                          const formatted = formatExpiryDate(e.target.value);
                          form.setValue('expiryDate', formatted);
                        }}
                        maxLength={5}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        value={form.watch('cvv') || ''}
                        onChange={(e) => {
                          const v = e.target.value.replace(/\D/g, '');
                          form.setValue('cvv', v);
                        }}
                        maxLength={4}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="cardHolderName">카드 소유자명</Label>
                    <Input
                      id="cardHolderName"
                      placeholder="홍길동"
                      value={form.watch('cardHolderName') || ''}
                      onChange={(e) =>
                        form.setValue('cardHolderName', e.target.value)
                      }
                    />
                  </div>
                </div>
              )}

              {/* 계좌이체 정보 */}
              {selectedMethod === 'bank' && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="bankCode">은행 선택</Label>
                    <Select
                      value={form.watch('bankCode') || ''}
                      onValueChange={(value) =>
                        form.setValue('bankCode', value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="은행을 선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        {banks.map((bank) => (
                          <SelectItem key={bank.code} value={bank.code}>
                            {bank.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="accountNumber">계좌번호</Label>
                    <Input
                      id="accountNumber"
                      placeholder="계좌번호를 입력하세요"
                      value={form.watch('accountNumber') || ''}
                      onChange={(e) => {
                        const v = e.target.value.replace(/\D/g, '');
                        form.setValue('accountNumber', v);
                      }}
                    />
                  </div>
                </div>
              )}

              {/* 간편결제 안내 */}
              {(selectedMethod === 'kakao' || selectedMethod === 'naver') && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Smartphone className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {selectedMethod === 'kakao' ? '카카오페이' : '네이버페이'}{' '}
                    결제
                  </h3>
                  <p className="text-gray-600">
                    결제 버튼을 클릭하면{' '}
                    {selectedMethod === 'kakao' ? '카카오페이' : '네이버페이'}{' '}
                    앱으로 이동합니다.
                  </p>
                </div>
              )}

              {/* 약관 동의 */}
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="agreeToTerms"
                    checked={form.watch('agreeToTerms') || false}
                    onChange={(e) =>
                      form.setValue('agreeToTerms', e.target.checked)
                    }
                    className="mt-1"
                  />
                  <label
                    htmlFor="agreeToTerms"
                    className="text-sm text-gray-600"
                  >
                    <a href="/terms" className="text-blue-600 hover:underline">
                      이용약관
                    </a>{' '}
                    및{' '}
                    <a
                      href="/privacy"
                      className="text-blue-600 hover:underline"
                    >
                      개인정보처리방침
                    </a>
                    에 동의합니다.
                  </label>
                </div>
              </div>

              {/* 결제 버튼 */}
              <div className="flex gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onPaymentCancel}
                  className="flex-1"
                >
                  취소
                </Button>
                <Button
                  type="submit"
                  disabled={isProcessing}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      처리 중...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      {formatPrice(totalAmount)} 결제하기
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* 보안 안내 */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-green-800">
            <Shield className="h-5 w-5" />
            <span className="font-medium">안전한 결제</span>
          </div>
          <p className="text-sm text-green-700 mt-1">
            모든 결제 정보는 SSL 암호화를 통해 안전하게 전송됩니다.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
