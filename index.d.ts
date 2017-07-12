import * as React from "react"

export as namespace SortableHOC

interface HOCConfig {
  withRef?: boolean
}

type Collection = string | number
type Axis = "x" | "y" | "xy"

interface SortableContainerProps {
  axis?: Axis
  distance?: number
  lockAxis?: Axis
  helperClass?: string
  transitionDuration?: number
  contentWindow?: any
  onSortStart?: (
    data: { node: Element; index: number; collection: Collection },
  ) => void
  onSortMove?: (e: PointerEvent) => void
  onSortEnd?: (
    data: { oldIndex: number; newIndex: number; collection: Collection },
  ) => void
  shouldCancelStart?: (e: PointerEvent) => boolean
  pressDelay?: number
  useDragHandle?: boolean
  useWindowAsScrollContainer?: boolean
  hideSortableGhost?: boolean
  lockToContainerEdges?: boolean
  lockOffset?: number | string | Array<number | string>
  getContainer?: (wrappedInstance: React.ReactElement) => Element
  getHelperDimensions?: (
    data: { node: Element; index: number; collection: Collection },
  ) => { width: number; height: number }
}

interface SortableElementProps {
  index: number
  collection?: Collection
  disabled?: boolean
}

export function SortableContainer<T>(
  WrappedComponent: React.ComponentType<T>,
  config?: HOCConfig,
): React.ComponentClass<T & SortableContainerProps>

export function SortableHandle<T>(
  WrappedComponent: React.ComponentType<T>,
  config?: HOCConfig,
): React.ComponentClass<T>

export function SortableElement<T>(
  WrappedComponent: React.ComponentType<T>,
  config?: HOCConfig,
): React.ComponentClass<T & SortableElementProps>

export const sortableContainer = SortableContainer
export const sortableElement = SortableElement
export const sortableHandle = SortableHandle

export function arrayMove(arr: any[], previousIndex: number, newIndex: number)
