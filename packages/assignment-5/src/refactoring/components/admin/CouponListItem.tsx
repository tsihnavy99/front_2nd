import { Coupon } from '../../../types';

interface Props {
  index: number;
  coupon: Coupon;
}

export const CouponListItem = ({ index, coupon }: Props) => {
  return (
    <div
      key={index}
      data-testid={`coupon-${index + 1}`}
      className="flex justify-between bg-gray-100 p-2 rounded"
    >
      <div>
        {coupon.name} ({coupon.code}):
        {coupon.discountType === 'amount'
          ? `${coupon.discountValue}원`
          : `${coupon.discountValue}%`}{' '}
        할인
      </div>
    </div>
  );
};
