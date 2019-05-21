export interface Workspace {
  components: Array<{
    title?: string;
    instances: Array<{
      title?: string;
      element: JSX.Element;
    }>;
  }>;
}
