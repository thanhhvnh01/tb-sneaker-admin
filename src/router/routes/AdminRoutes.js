import { lazy } from 'react';

const AdminRoutes = [
  {
    path: '/categories',
    exact: true,
    component: lazy(() => import(`@views/categories/Categories`)),
  },
  {
    path: '/product-group',
    exact: true,
    component: lazy(() => import(`@views/product-types/ProductTypes`)),
  },
  {
    path: '/colors',
    exact: true,
    component: lazy(() => import(`@views/colors/Colors`)),
  },
  {
    path: '/products',
    exact: true,
    component: lazy(() => import(`@views/products/Products`)),
  },
  {
    path: '/supporters',
    exact: true,
    component: lazy(() => import(`@views/supporters/Supporters`)),
  },
  {
    path: '/subscribers',
    exact: true,
    component: lazy(() => import(`@views/subscribers/Subscribers`)),
  },
  {
    path: '/contacts',
    exact: true,
    component: lazy(() => import(`@views/contacts/Contacts`)),
  },
  {
    path: '/orders',
    exact: true,
    component: lazy(() => import(`@views/cover/Covers`)),
  },
];

export default AdminRoutes;
