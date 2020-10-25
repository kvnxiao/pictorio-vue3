/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
declare module "*.vue" {
  import type { DefineComponent } from "vue"
  const component: DefineComponent<{}, {}, any>
  export default component
}
