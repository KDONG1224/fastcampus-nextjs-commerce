// categories name
export const CATEGORY_NAME = ['Sneakers', 'T-Shirt', 'Pants', 'Cap', 'Hoodie'];

// default Page
export const TAKE_PAGE = 9;

// blurData
export const blurDataURL =
  'data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFklEQVR42mN8//HLfwYiAOOoQvoqBABbWyZJf74GZgAAAABJRU5ErkJggg==';

// filter
export const FILTERS = [
  {
    label: '최신순',
    value: 'latest'
  },
  {
    label: '가격 높은 순',
    value: 'expensive'
  },
  {
    label: '가격 낮은 순',
    value: 'cheap'
  }
];

// orderBy
export const getOrderBy = (orderBy?: string) => {
  return orderBy
    ? orderBy === 'latest'
      ? { orderBy: { createdAt: 'desc' } }
      : orderBy === 'expensive'
      ? { orderBy: { price: 'desc' } }
      : { orderBy: { price: 'asc' } }
    : undefined;
};

export const ORDER_STATUS = [
  '주문취소',
  '주문대기',
  '결제대기',
  '결제완료',
  '배송대기',
  '배송중',
  '배송완료',
  '환불대기',
  '환불완료',
  '반품대기',
  '반품완료'
];
