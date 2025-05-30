import {
  Link,
  Outlet,
  createRootRouteWithContext,
} from '@tanstack/react-router'

import type { QueryClient } from '@tanstack/react-query'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <div className="h-dvh flex flex-col">
      <div className="border-b">
        <header className="py-6 px-4 max-w-3xl w-full mx-auto">
          <Link to="/">
            <h1 className="text-xl font-semibold">Noah Vega</h1>
          </Link>
        </header>
      </div>
      <main className="flex-1">
        <div className="h-full max-w-3xl w-full mx-auto p-4">
          <Outlet />
        </div>
      </main>
      {/* <TanStackRouterDevtools /> */}
    </div>
  ),
})
