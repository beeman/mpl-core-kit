import { createBrowserRouter, Navigate } from 'react-router'

import type { ShellNotFoundProps } from '@/shell/data-access/shell-not-found-props'

import { ShellFeature, ShellUiLoader } from '@/shell/feature'

export const appRouter = createBrowserRouter([
  {
    children: [
      { element: <Navigate replace to="/create" />, index: true },
      {
        lazy: () => import('@/mpl-core/feature/mpl-core-feature-create'),
        path: 'create',
      },
      {
        lazy: () => import('@/mpl-core/feature/mpl-core-feature-explorer'),
        path: 'explorer',
      },
      {
        lazy: () => import('@/mpl-core/feature/mpl-core-feature-explorer-collection'),
        path: 'explorer/collection/:mint',
      },
      {
        lazy: () => import('@/mpl-core/feature/mpl-core-feature-explorer-asset'),
        path: 'explorer/:mint',
      },
      {
        lazy: () => import('@/shell/feature/shell-not-found-feature'),
        loader: (): ShellNotFoundProps => ({
          links: [
            {
              description: 'Open the create flow to mint Core assets and collections with the vendored kit client.',
              title: 'Create',
              to: '/create',
            },
            {
              description: 'Search Core assets and collections, then inspect owned items and decoded plugin state.',
              title: 'Explorer',
              to: '/explorer',
            },
          ],
        }),
        path: '*',
      },
    ],
    element: (
      <ShellFeature
        links={[
          { label: 'Create', to: '/create' },
          { label: 'Explorer', to: '/explorer' },
        ]}
      />
    ),
    hydrateFallbackElement: <ShellUiLoader fullScreen />,
  },
])
