import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { categories, products } from '@prisma/client';
import { Input, Pagination, SegmentedControl, Select } from '@mantine/core';
import { blurDataURL, CATEGORY_NAME, FILTERS, TAKE_PAGE } from 'const';
import { css } from '@emotion/react';
import { IconSearch } from '@tabler/icons';
import { useDebounce } from 'hooks';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

const Products = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const [activePage, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>('-1');
  const [selectedFilter, setSelectedFilter] = useState<string | null>(
    FILTERS[0].value
  );
  const [keyword, setKeyword] = useState('');

  const debouncedKeyword = useDebounce<string>(keyword);

  const { data: products } = useQuery<
    { items: products[] },
    unknown,
    products[]
  >(
    [
      `/api/get-products?skip=${
        TAKE_PAGE * (activePage - 1)
      }&take=${TAKE_PAGE}&category=${selectedCategory}&orderBy=${selectedFilter}&contains=${debouncedKeyword}`
    ],
    () =>
      fetch(
        `/api/get-products?skip=${
          TAKE_PAGE * (activePage - 1)
        }&take=${TAKE_PAGE}&category=${selectedCategory}&orderBy=${selectedFilter}&contains=${debouncedKeyword}`
      ).then((res) => res.json()),
    {
      select: (data) => data.items
    }
  );

  const { data: categories } = useQuery<
    { items: categories[] },
    unknown,
    categories[]
  >(
    [`/api/get-categories`],
    () => fetch(`/api/get-categories`).then((res) => res.json()),
    { select: (data) => data.items }
  );

  const { data: total } = useQuery(
    [
      `/api/get-products-count?category=${selectedCategory}&contains=${debouncedKeyword}`
    ],
    () =>
      fetch(
        `/api/get-products-count?category=${selectedCategory}&contains=${debouncedKeyword}`
      )
        .then((res) => res.json())
        .then((data) => Math.ceil(data.items / TAKE_PAGE))
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  return (
    <div className="px-36 mt-36 mb-36">
      {session && <div>안녕하세요! {session?.user?.name}님</div>}
      {/* 검색 */}
      <div className="mb-4">
        <Input
          icon={<IconSearch />}
          value={keyword}
          onChange={handleInputChange}
          placeholder="검색어를 입력해주세요."
        />
      </div>
      {/* 필터 */}
      <div className="mb-4">
        <Select
          value={selectedFilter}
          onChange={setSelectedFilter}
          data={FILTERS}
        />
      </div>
      {/* 카테고리 */}
      {categories && (
        <div className="mb-4">
          <SegmentedControl
            value={selectedCategory}
            onChange={setSelectedCategory}
            data={[
              { label: 'ALL', value: '-1' },
              ...categories.map((category) => ({
                label: category.name,
                value: String(category.id)
              }))
            ]}
            color="dark"
          />
        </div>
      )}
      {/* 상품 */}
      {products && (
        <div className="grid grid-cols-3 gap-5">
          {products.map((item) => (
            <div
              key={item.id}
              css={css`
                max-width: 310;
              `}
              onClick={() => router.push(`/products/${item.id}`)}
            >
              <Image
                className="rounded"
                src={item.image_url as string}
                alt={item.name}
                width={300}
                height={200}
                placeholder="blur"
                blurDataURL={blurDataURL}
              />
              <div className="flex">
                <span>{item.name}</span>
                <span className="ml-auto">
                  {item.price.toLocaleString('ko-KR')}원
                </span>
              </div>
              <span className="text-zinc-400">
                {CATEGORY_NAME[item.category_id - 1]}
              </span>
            </div>
          ))}
        </div>
      )}
      {/* 페이지네이션 */}
      <div className="w-full flex mt-5">
        {total && (
          <Pagination
            className="m-auto"
            page={activePage}
            onChange={setPage}
            total={total}
          />
        )}
      </div>
    </div>
  );
};

export default Products;
