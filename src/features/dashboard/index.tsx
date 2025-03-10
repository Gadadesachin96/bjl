// import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent, // CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
// import { TopNav } from '@/components/layout/top-nav'
// import { Overview } from './components/overview'
// import { RecentSales } from './components/recent-sales'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'

export default function Dashboard() {
  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        {/* <TopNav links={topNav} /> */}
        <div className='ml-auto flex items-center space-x-4'>
          <Search />
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      {/* ===== Main ===== */}
      <Main>
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <h1 className='text-2xl font-bold tracking-tight'>Dashboard</h1>
          {/* <div className='flex items-center space-x-2'>
            <Button>Download</Button>
          </div> */}
        </div>
        <Tabs
          orientation='vertical'
          defaultValue='overview'
          className='space-y-4'
        >
          <div className='w-full overflow-x-auto pb-2'>
            <TabsList>
              <TabsTrigger value='overview'>Overview</TabsTrigger>
              <TabsTrigger value='analytics' disabled>
                Analytics
              </TabsTrigger>
              <TabsTrigger value='reports' disabled>
                Reports
              </TabsTrigger>
              <TabsTrigger value='notifications' disabled>
                Notifications
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value='overview' className='space-y-4'>
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Total Revenue
                  </CardTitle>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    className='h-4 w-4 text-muted-foreground'
                  >
                    <path d='M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>$45,231.89</div>
                  <p className='text-xs text-muted-foreground'>
                    +20.1% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Subscriptions
                  </CardTitle>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    className='h-4 w-4 text-muted-foreground'
                  >
                    <path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' />
                    <circle cx='9' cy='7' r='4' />
                    <path d='M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75' />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>+2350</div>
                  <p className='text-xs text-muted-foreground'>
                    +180.1% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>Sales</CardTitle>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    className='h-4 w-4 text-muted-foreground'
                  >
                    <rect width='20' height='14' x='2' y='5' rx='2' />
                    <path d='M2 10h20' />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>+12,234</div>
                  <p className='text-xs text-muted-foreground'>
                    +19% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Active Now
                  </CardTitle>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    className='h-4 w-4 text-muted-foreground'
                  >
                    <path d='M22 12h-4l-3 9L9 3l-3 9H2' />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>+573</div>
                  <p className='text-xs text-muted-foreground'>
                    +201 since last hour
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className='flex-grow'>
              {/* <Card className='col-span-1 lg:col-span-4'>
                <CardHeader>
                  <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent className='pl-2'>
                  <Overview />
                </CardContent>
              </Card> */}
              {/* <Card className='col-span-1 lg:col-span-3'>
                <CardHeader>
                  <CardTitle>Recent Sales</CardTitle>
                  <CardDescription>
                    You made 265 sales this month.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentSales />
                </CardContent>
              </Card> */}
            </div>

            <Table className='overflow-hidden rounded-lg border border-gray-300 shadow-md'>
              <TableHeader className='bg-gray-100'>
                <TableRow>
                  {tableHeaders.map((header, index) => (
                    <TableHead
                      key={index}
                      className='px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider dark:bg-gray-900'
                    >
                      {header}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order, index) => (
                  <TableRow
                    key={index}
                    className="bg-black-200 "
                  >
                    {Object.values(order).map((value, i) => (
                      <TableCell key={i} className='px-4 py-3'>
                        {value}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </Main>
    </>
  )
}

const topNav = [
  {
    title: 'Overview',
    href: 'dashboard/overview',
    isActive: true,
    disabled: false,
  },
  {
    title: 'Customers',
    href: 'dashboard/customers',
    isActive: false,
    disabled: true,
  },
  {
    title: 'Products',
    href: 'dashboard/products',
    isActive: false,
    disabled: true,
  },
  {
    title: 'Settings',
    href: 'dashboard/settings',
    isActive: false,
    disabled: true,
  },
]

const tableHeaders = [
  'store',
  'order no',
  'customer',
  'view order',
  'discount',
  'channel',
  'total',
  'date/time',
]

const orders = [
  {
    store: 'SuperMart',
    orderNo: 'ORD12345',
    customer: 'John Doe',
    viewOrder: 'View',
    discount: '10%',
    channel: 'Online',
    total: '$150.00',
    dateTime: '2024-03-04 12:30 PM',
  },
  {
    store: 'FreshFoods',
    orderNo: 'ORD12346',
    customer: 'Jane Smith',
    viewOrder: 'View',
    discount: '5%',
    channel: 'In-Store',
    total: '$75.50',
    dateTime: '2024-03-04 01:15 PM',
  },
  {
    store: 'GroceryPlus',
    orderNo: 'ORD12347',
    customer: 'Emily Johnson',
    viewOrder: 'View',
    discount: '15%',
    channel: 'Online',
    total: '$200.75',
    dateTime: '2024-03-04 02:00 PM',
  },
  {
    store: 'DailyNeeds',
    orderNo: 'ORD12348',
    customer: 'Michael Brown',
    viewOrder: 'View',
    discount: '8%',
    channel: 'App',
    total: '$95.25',
    dateTime: '2024-03-04 03:45 PM',
  },
  {
    store: 'MegaStore',
    orderNo: 'ORD12349',
    customer: 'Sarah Williams',
    viewOrder: 'View',
    discount: '12%',
    channel: 'Online',
    total: '$175.99',
    dateTime: '2024-03-04 05:30 PM',
  },
  {
    store: 'HomeEssentials',
    orderNo: 'ORD12350',
    customer: 'David Miller',
    viewOrder: 'View',
    discount: '20%',
    channel: 'In-Store',
    total: '$250.00',
    dateTime: '2024-03-04 06:10 PM',
  },
  {
    store: 'QuickMart',
    orderNo: 'ORD12351',
    customer: 'Sophia Lee',
    viewOrder: 'View',
    discount: '7%',
    channel: 'Online',
    total: '$80.99',
    dateTime: '2024-03-04 07:20 PM',
  },
  {
    store: 'DailyMart',
    orderNo: 'ORD12352',
    customer: 'James Anderson',
    viewOrder: 'View',
    discount: '10%',
    channel: 'App',
    total: '$120.50',
    dateTime: '2024-03-04 08:05 PM',
  },
]
