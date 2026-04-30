import { type ComponentType, useId } from 'react'

export type SearchPillTabId = 'flights' | 'hotels' | 'cars' | 'packages'
export type SearchPillSize = 'sm' | 'md' | 'lg'

export interface SearchPillTab {
  id: SearchPillTabId
  label: string
}

const ICON_SIZE_CLASS: Record<SearchPillSize, string> = {
  sm: 'w-[14px] h-[14px]',
  md: 'w-[18px] h-[18px]',
  lg: 'w-[22px] h-[22px]',
}

function TabIconWrap({
  children,
  size,
}: {
  children: React.ReactNode
  size: SearchPillSize
}) {
  return (
    <span
      className={`flex flex-shrink-0 ${ICON_SIZE_CLASS[size]} text-current max-md:w-[18px] max-md:h-[18px] [&_svg]:block [&_svg]:w-full [&_svg]:h-full`}
      aria-hidden
    >
      {children}
    </span>
  )
}

function FlightsTabIcon({ size }: { size: SearchPillSize }) {
  return (
    <TabIconWrap size={size}>
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M17.7448 2.81298C18.7095 1.8165 20.3036 1.80361 21.2843 2.78436C22.2382 3.73823 22.2559 5.27921 21.3243 6.25481L18.5456 9.16457C18.3278 9.39265 18.219 9.50668 18.1518 9.64024C18.0924 9.75847 18.0571 9.88732 18.0478 10.0193C18.0374 10.1684 18.0728 10.3221 18.1438 10.6293L19.8717 18.1169C19.9444 18.4323 19.9808 18.59 19.9691 18.7426C19.9587 18.8776 19.921 19.0091 19.8582 19.1291C19.7873 19.2647 19.6729 19.3792 19.444 19.608L19.0732 19.9788C18.4671 20.585 18.164 20.888 17.8538 20.9429C17.583 20.9908 17.3043 20.925 17.0835 20.761C16.8306 20.5733 16.695 20.1666 16.424 19.3534L14.4142 13.3241L11.0689 16.6695C10.8692 16.8691 10.7694 16.969 10.7026 17.0866C10.6434 17.1907 10.6034 17.3047 10.5846 17.423C10.5633 17.5565 10.5789 17.6968 10.61 17.9775L10.7937 19.6309C10.8249 19.9116 10.8405 20.0519 10.8192 20.1854C10.8004 20.3037 10.7604 20.4177 10.7012 20.5219C10.6344 20.6394 10.5346 20.7393 10.3349 20.939L10.1374 21.1365C9.66434 21.6095 9.42781 21.8461 9.16496 21.9146C8.93442 21.9746 8.68999 21.9504 8.47571 21.8463C8.2314 21.7276 8.04585 21.4493 7.67475 20.8926L6.10643 18.5401C6.04013 18.4407 6.00698 18.391 5.96849 18.3459C5.9343 18.3058 5.89701 18.2685 5.85694 18.2343C5.81184 18.1958 5.76212 18.1627 5.66267 18.0964L3.31018 16.5281C2.75354 16.157 2.47521 15.9714 2.35649 15.7271C2.25236 15.5128 2.22816 15.2684 2.28824 15.0378C2.35674 14.775 2.59327 14.5385 3.06633 14.0654L3.26384 13.8679C3.46352 13.6682 3.56337 13.5684 3.68095 13.5016C3.78511 13.4424 3.89906 13.4024 4.01736 13.3836C4.15089 13.3623 4.29123 13.3779 4.5719 13.4091L6.22529 13.5928C6.50596 13.6239 6.6463 13.6395 6.77983 13.6182C6.89813 13.5994 7.01208 13.5594 7.11624 13.5002C7.23382 13.4334 7.33366 13.3336 7.53335 13.1339L10.8787 9.7886L4.84939 7.77884C4.03616 7.50776 3.62955 7.37222 3.44176 7.11932C3.27777 6.89848 3.212 6.61984 3.2599 6.34898C3.31477 6.03879 3.61784 5.73572 4.22399 5.12957L4.59476 4.7588C4.82365 4.52991 4.9381 4.41546 5.07369 4.34457C5.1937 4.28183 5.3252 4.24411 5.46023 4.23371C5.61278 4.22197 5.77049 4.25836 6.0859 4.33115L13.545 6.05249C13.855 6.12401 14.01 6.15978 14.1596 6.14914C14.3041 6.13886 14.4446 6.09733 14.5714 6.02742C14.7028 5.95501 14.8134 5.84074 15.0347 5.6122L17.7448 2.81298Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </TabIconWrap>
  )
}

function HotelsTabIcon({ size }: { size: SearchPillSize }) {
  return (
    <TabIconWrap size={size}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2 4v16" />
        <path d="M2 8h18a2 2 0 0 1 2 2v8" />
        <path d="M2 17h20" />
        <path d="M6 8v9" />
      </svg>
    </TabIconWrap>
  )
}

function CarsTabIcon({ size }: { size: SearchPillSize }) {
  return (
    <TabIconWrap size={size}>
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M5 13H8M2 9L4 10L5.27064 6.18807C5.53292 5.40125 5.66405 5.00784 5.90729 4.71698C6.12208 4.46013 6.39792 4.26132 6.70951 4.13878C7.06236 4 7.47705 4 8.30643 4H15.6936C16.523 4 16.9376 4 17.2905 4.13878C17.6021 4.26132 17.8779 4.46013 18.0927 4.71698C18.3359 5.00784 18.4671 5.40125 18.7294 6.18807L20 10L22 9M16 13H19M6.8 10H17.2C18.8802 10 19.7202 10 20.362 10.327C20.9265 10.6146 21.3854 11.0735 21.673 11.638C22 12.2798 22 13.1198 22 14.8V17.5C22 17.9647 22 18.197 21.9616 18.3902C21.8038 19.1836 21.1836 19.8038 20.3902 19.9616C20.197 20 19.9647 20 19.5 20H19C17.8954 20 17 19.1046 17 18C17 17.7239 16.7761 17.5 16.5 17.5H7.5C7.22386 17.5 7 17.7239 7 18C7 19.1046 6.10457 20 5 20H4.5C4.03534 20 3.80302 20 3.60982 19.9616C2.81644 19.8038 2.19624 19.1836 2.03843 18.3902C2 18.197 2 17.9647 2 17.5V14.8C2 13.1198 2 12.2798 2.32698 11.638C2.6146 11.0735 3.07354 10.6146 3.63803 10.327C4.27976 10 5.11984 10 6.8 10Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </TabIconWrap>
  )
}

function PackagesTabIcon({ size }: { size: SearchPillSize }) {
  return (
    <TabIconWrap size={size}>
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M16 7C16 6.07003 16 5.60504 15.8978 5.22354C15.6204 4.18827 14.8117 3.37962 13.7765 3.10222C13.395 3 12.93 3 12 3C11.07 3 10.605 3 10.2235 3.10222C9.18827 3.37962 8.37962 4.18827 8.10222 5.22354C8 5.60504 8 6.07003 8 7M12.8 17.5H17.7C17.98 17.5 18.12 17.5 18.227 17.4455C18.3211 17.3976 18.3976 17.3211 18.4455 17.227C18.5 17.12 18.5 16.98 18.5 16.7V14.3C18.5 14.02 18.5 13.88 18.4455 13.773C18.3976 13.6789 18.3211 13.6024 18.227 13.5545C18.12 13.5 17.98 13.5 17.7 13.5H12.8C12.52 13.5 12.38 13.5 12.273 13.5545C12.1789 13.6024 12.1024 13.6789 12.0545 13.773C12 13.88 12 14.02 12 14.3V16.7C12 16.98 12 17.12 12.0545 17.227C12.1024 17.3211 12.1789 17.3976 12.273 17.4455C12.38 17.5 12.52 17.5 12.8 17.5ZM6.8 21H17.2C18.8802 21 19.7202 21 20.362 20.673C20.9265 20.3854 21.3854 19.9265 21.673 19.362C22 18.7202 22 17.8802 22 16.2V11.8C22 10.1198 22 9.27976 21.673 8.63803C21.3854 8.07354 20.9265 7.6146 20.362 7.32698C19.7202 7 18.8802 7 17.2 7H6.8C5.11984 7 4.27976 7 3.63803 7.32698C3.07354 7.6146 2.6146 8.07354 2.32698 8.63803C2 9.27976 2 10.1198 2 11.8V16.2C2 17.8802 2 18.7202 2.32698 19.362C2.6146 19.9265 3.07354 20.3854 3.63803 20.673C4.27976 21 5.11984 21 6.8 21Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </TabIconWrap>
  )
}

const TAB_ICONS: Record<SearchPillTabId, ComponentType<{ size: SearchPillSize }>> = {
  flights: FlightsTabIcon,
  hotels: HotelsTabIcon,
  cars: CarsTabIcon,
  packages: PackagesTabIcon,
}

const SEARCH_TABS: readonly SearchPillTab[] = [
  { id: 'flights', label: 'Flights' },
  { id: 'hotels', label: 'Hotels' },
  { id: 'cars', label: 'Cars' },
]

export interface SearchPillsProps {
  tabs?: readonly SearchPillTab[]
  selectedTab?: SearchPillTabId
  onSelectTab?: (id: SearchPillTabId) => void
  id?: string
  size?: SearchPillSize
}

const PILL_SIZE_CLASS: Record<SearchPillSize, string> = {
  sm: 'gap-[6px] px-[10px] py-[6px] text-[13px]',
  md: 'gap-2 px-3 py-[10px] text-[16px]',
  lg: 'gap-[10px] px-[18px] py-[14px] text-[18px]',
}

export function SearchPills({
  tabs = SEARCH_TABS,
  selectedTab,
  onSelectTab,
  id,
  size = 'md',
}: SearchPillsProps) {
  const autoId = useId()
  const pillsId = id || autoId
  const interactive = Boolean(onSelectTab)

  return (
    <div
      id={pillsId}
      className="flex flex-wrap justify-start items-center gap-2 max-md:flex-nowrap max-md:gap-[6px] max-md:w-full"
      role={interactive ? 'tablist' : 'group'}
      aria-label="What are you booking?"
    >
      {tabs.map(tab => {
        const Icon = TAB_ICONS[tab.id]
        const selected = selectedTab === tab.id
        const cursorClass = interactive ? 'cursor-pointer' : 'cursor-default hover:cursor-pointer'
        const base = `inline-flex items-center justify-center ${PILL_SIZE_CLASS[size]} font-medium border rounded-full ${cursorClass} select-none transition-[color,background,border-color] duration-150 max-md:flex-1 max-md:min-w-0 max-md:flex-col max-md:items-center max-md:justify-center max-md:gap-1 max-md:px-1 max-md:py-2 max-md:rounded-[12px] max-md:text-center focus-visible:outline-2 focus-visible:outline-purple focus-visible:outline-offset-2`
        const stateClasses = selected
          ? 'bg-purple text-grey-100 border-purple hover:bg-purple-hover hover:border-purple-hover'
          : 'bg-white text-grey-600 border-grey-200 hover:text-purple hover:border-purple'
        const label = (
          <>
            {Icon ? <Icon size={size} /> : null}
            <span className="max-md:block max-md:max-w-full max-md:text-[11px] max-md:font-medium max-md:leading-[1.15] max-md:whitespace-normal max-md:break-words">
              {tab.label}
            </span>
          </>
        )
        if (interactive) {
          return (
            <button
              key={tab.id}
              id={`${pillsId}-${tab.id}`}
              type="button"
              role="tab"
              aria-selected={selected}
              className={`${base} ${stateClasses} m-0 appearance-none`}
              style={{ padding: '20px' }}
              onClick={() => onSelectTab?.(tab.id)}
            >
              {label}
            </button>
          )
        }
        return (
          <span
            key={tab.id}
            id={`${pillsId}-${tab.id}`}
            className={`${base} ${stateClasses}`}
            aria-current={selected ? 'page' : undefined}
          >
            {label}
          </span>
        )
      })}
    </div>
  )
}
