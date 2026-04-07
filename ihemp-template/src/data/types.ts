export interface Resource {
  title?: string
  url?: string
  description?: string
  [key: string]: any
}

export interface State {
  name: string
  slug?: string
  abbreviation?: string
  status?: string
  resources?: Resource[]
  [key: string]: any
}
