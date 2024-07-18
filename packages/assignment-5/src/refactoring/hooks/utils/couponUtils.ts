import { Coupon } from '../../../types';

export const removeFromCouponsByCode = (
  coupons: Coupon[],
  couponCode: string
) => {
  return coupons.filter((coupon) => coupon.code !== couponCode);
};

export const findIndexOfSelectedCoupon = (
  coupons: Coupon[],
  selectedCoupon: Coupon
) => {
  return coupons.findIndex((coupon) => coupon.code === selectedCoupon.code);
};
