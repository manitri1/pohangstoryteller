'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  CreditCard,
  Truck,
  MapPin,
  Phone,
  Mail,
  User,
  Package,
  CheckCircle,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: any;
  projectData: any;
}

interface OrderForm {
  quantity: number;
  paperType: string;
  size: string;
  shippingAddress: {
    name: string;
    phone: string;
    email: string;
    address: string;
    detail: string;
    zipCode: string;
  };
  paymentMethod: string;
  specialInstructions: string;
}

export function OrderModal({
  isOpen,
  onClose,
  template,
  projectData,
}: OrderModalProps) {
  const [currentStep, setCurrentStep] = useState<
    'options' | 'shipping' | 'payment' | 'confirmation'
  >('options');
  const [orderForm, setOrderForm] = useState<OrderForm>({
    quantity: 1,
    paperType: 'standard',
    size: 'A4',
    shippingAddress: {
      name: '',
      phone: '',
      email: '',
      address: '',
      detail: '',
      zipCode: '',
    },
    paymentMethod: 'card',
    specialInstructions: '',
  });

  const [isProcessing, setIsProcessing] = useState(false);

  const paperTypes = [
    { value: 'standard', label: '일반 용지', price: 0 },
    { value: 'premium', label: '프리미엄 용지', price: 2000 },
    { value: 'glossy', label: '광택 용지', price: 1500 },
  ];

  const sizes = [
    { value: 'A4', label: 'A4 (210×297mm)', price: 0 },
    { value: 'A5', label: 'A5 (148×210mm)', price: -1000 },
    { value: 'A3', label: 'A3 (297×420mm)', price: 2000 },
  ];

  const calculateTotal = () => {
    const basePrice = template.basePrice;
    const paperPrice =
      paperTypes.find((p) => p.value === orderForm.paperType)?.price || 0;
    const sizePrice = sizes.find((s) => s.value === orderForm.size)?.price || 0;
    const shippingCost = 3000;

    return (
      (basePrice + paperPrice + sizePrice) * orderForm.quantity + shippingCost
    );
  };

  const handleNext = () => {
    if (currentStep === 'options') {
      setCurrentStep('shipping');
    } else if (currentStep === 'shipping') {
      setCurrentStep('payment');
    } else if (currentStep === 'payment') {
      setCurrentStep('confirmation');
    }
  };

  const handleBack = () => {
    if (currentStep === 'shipping') {
      setCurrentStep('options');
    } else if (currentStep === 'payment') {
      setCurrentStep('shipping');
    } else if (currentStep === 'confirmation') {
      setCurrentStep('payment');
    }
  };

  const handleOrder = async () => {
    setIsProcessing(true);

    try {
      // 실제 주문 처리 로직
      await new Promise((resolve) => setTimeout(resolve, 2000)); // 시뮬레이션

      toast({
        title: '주문 완료',
        description: '기념품 주문이 성공적으로 완료되었습니다.',
      });

      onClose();
    } catch (error) {
      toast({
        title: '주문 실패',
        description: '주문 처리 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>기념품 주문</DialogTitle>
          <DialogDescription>
            {template.name} 기념품을 주문하세요.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 주문 정보 */}
          <div className="space-y-4">
            {currentStep === 'options' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">주문 옵션</h3>

                <div>
                  <Label>수량</Label>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={orderForm.quantity}
                    onChange={(e) =>
                      setOrderForm({
                        ...orderForm,
                        quantity: parseInt(e.target.value) || 1,
                      })
                    }
                  />
                </div>

                <div>
                  <Label>용지 종류</Label>
                  <Select
                    value={orderForm.paperType}
                    onValueChange={(value) =>
                      setOrderForm({
                        ...orderForm,
                        paperType: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {paperTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}{' '}
                          {type.price > 0
                            ? `(+₩${type.price.toLocaleString()})`
                            : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>크기</Label>
                  <Select
                    value={orderForm.size}
                    onValueChange={(value) =>
                      setOrderForm({
                        ...orderForm,
                        size: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {sizes.map((size) => (
                        <SelectItem key={size.value} value={size.value}>
                          {size.label}{' '}
                          {size.price !== 0
                            ? `(${
                                size.price > 0 ? '+' : ''
                              }₩${size.price.toLocaleString()})`
                            : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>특별 요청사항</Label>
                  <Textarea
                    placeholder="특별한 요청사항이 있으시면 입력해주세요."
                    value={orderForm.specialInstructions}
                    onChange={(e) =>
                      setOrderForm({
                        ...orderForm,
                        specialInstructions: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            )}

            {currentStep === 'shipping' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">배송 정보</h3>

                <div>
                  <Label>받는 사람</Label>
                  <Input
                    value={orderForm.shippingAddress.name}
                    onChange={(e) =>
                      setOrderForm({
                        ...orderForm,
                        shippingAddress: {
                          ...orderForm.shippingAddress,
                          name: e.target.value,
                        },
                      })
                    }
                    placeholder="이름을 입력하세요"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label>연락처</Label>
                    <Input
                      value={orderForm.shippingAddress.phone}
                      onChange={(e) =>
                        setOrderForm({
                          ...orderForm,
                          shippingAddress: {
                            ...orderForm.shippingAddress,
                            phone: e.target.value,
                          },
                        })
                      }
                      placeholder="010-0000-0000"
                    />
                  </div>
                  <div>
                    <Label>이메일</Label>
                    <Input
                      type="email"
                      value={orderForm.shippingAddress.email}
                      onChange={(e) =>
                        setOrderForm({
                          ...orderForm,
                          shippingAddress: {
                            ...orderForm.shippingAddress,
                            email: e.target.value,
                          },
                        })
                      }
                      placeholder="example@email.com"
                    />
                  </div>
                </div>

                <div>
                  <Label>우편번호</Label>
                  <div className="flex gap-2">
                    <Input
                      value={orderForm.shippingAddress.zipCode}
                      onChange={(e) =>
                        setOrderForm({
                          ...orderForm,
                          shippingAddress: {
                            ...orderForm.shippingAddress,
                            zipCode: e.target.value,
                          },
                        })
                      }
                      placeholder="12345"
                    />
                    <Button variant="outline">검색</Button>
                  </div>
                </div>

                <div>
                  <Label>주소</Label>
                  <Input
                    value={orderForm.shippingAddress.address}
                    onChange={(e) =>
                      setOrderForm({
                        ...orderForm,
                        shippingAddress: {
                          ...orderForm.shippingAddress,
                          address: e.target.value,
                        },
                      })
                    }
                    placeholder="기본 주소"
                  />
                </div>

                <div>
                  <Label>상세 주소</Label>
                  <Input
                    value={orderForm.shippingAddress.detail}
                    onChange={(e) =>
                      setOrderForm({
                        ...orderForm,
                        shippingAddress: {
                          ...orderForm.shippingAddress,
                          detail: e.target.value,
                        },
                      })
                    }
                    placeholder="상세 주소"
                  />
                </div>
              </div>
            )}

            {currentStep === 'payment' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">결제 방법</h3>

                <div className="space-y-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={orderForm.paymentMethod === 'card'}
                      onChange={(e) =>
                        setOrderForm({
                          ...orderForm,
                          paymentMethod: e.target.value,
                        })
                      }
                    />
                    <CreditCard className="h-4 w-4" />
                    <span>신용카드</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value="bank"
                      checked={orderForm.paymentMethod === 'bank'}
                      onChange={(e) =>
                        setOrderForm({
                          ...orderForm,
                          paymentMethod: e.target.value,
                        })
                      }
                    />
                    <span>계좌이체</span>
                  </label>
                </div>
              </div>
            )}

            {currentStep === 'confirmation' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">주문 확인</h3>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">{template.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span>수량:</span>
                      <span>{orderForm.quantity}개</span>
                    </div>
                    <div className="flex justify-between">
                      <span>용지:</span>
                      <span>
                        {
                          paperTypes.find(
                            (p) => p.value === orderForm.paperType
                          )?.label
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>크기:</span>
                      <span>
                        {sizes.find((s) => s.value === orderForm.size)?.label}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold">
                      <span>총 금액:</span>
                      <span>₩{calculateTotal().toLocaleString()}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* 주문 요약 */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">주문 요약</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>기본 가격:</span>
                  <span>₩{template.basePrice.toLocaleString()}</span>
                </div>

                {orderForm.quantity > 1 && (
                  <div className="flex justify-between">
                    <span>수량 ({orderForm.quantity}개):</span>
                    <span>
                      ₩
                      {(
                        template.basePrice *
                        (orderForm.quantity - 1)
                      ).toLocaleString()}
                    </span>
                  </div>
                )}

                {(() => {
                  const paperPrice =
                    paperTypes.find((p) => p.value === orderForm.paperType)
                      ?.price || 0;
                  const sizePrice =
                    sizes.find((s) => s.value === orderForm.size)?.price || 0;
                  const totalOptions =
                    (paperPrice + sizePrice) * orderForm.quantity;

                  if (totalOptions > 0) {
                    return (
                      <div className="flex justify-between">
                        <span>옵션 추가:</span>
                        <span>₩{totalOptions.toLocaleString()}</span>
                      </div>
                    );
                  }
                  return null;
                })()}

                <div className="flex justify-between">
                  <span>배송비:</span>
                  <span>₩3,000</span>
                </div>

                <Separator />

                <div className="flex justify-between font-semibold text-lg">
                  <span>총 금액:</span>
                  <span>₩{calculateTotal().toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>

            {/* 단계 표시 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {['options', 'shipping', 'payment', 'confirmation'].map(
                  (step, index) => (
                    <div key={step} className="flex items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                          currentStep === step
                            ? 'bg-blue-500 text-white'
                            : index <
                              [
                                'options',
                                'shipping',
                                'payment',
                                'confirmation',
                              ].indexOf(currentStep)
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {index <
                        [
                          'options',
                          'shipping',
                          'payment',
                          'confirmation',
                        ].indexOf(currentStep) ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          index + 1
                        )}
                      </div>
                      {index < 3 && (
                        <div
                          className={`w-8 h-0.5 ${
                            index <
                            [
                              'options',
                              'shipping',
                              'payment',
                              'confirmation',
                            ].indexOf(currentStep)
                              ? 'bg-green-500'
                              : 'bg-gray-200'
                          }`}
                        />
                      )}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={currentStep === 'options' ? onClose : handleBack}
          >
            {currentStep === 'options' ? '취소' : '이전'}
          </Button>

          <Button
            onClick={currentStep === 'confirmation' ? handleOrder : handleNext}
            disabled={isProcessing}
          >
            {isProcessing
              ? '처리 중...'
              : currentStep === 'confirmation'
              ? '주문하기'
              : '다음'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
