export type ExtendComponentProps<T extends React.ComponentType, U> = T extends React.ComponentType<infer P>
    ? P & U
    : never;
