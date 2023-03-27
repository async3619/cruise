import React from "react";
import shortid from "shortid";

import { Backdrop, CircularProgress } from "@mui/material";

import {
    DialogContext,
    DialogContextValue,
    DialogPropBase,
    DialogResult,
    LoadingSnackbarInstance,
    SnackbarGlobalOptions,
    SnackbarInstance,
    SnackbarItem,
    SnackbarOptions,
} from "@dialogs";
import SnackbarContainer from "@dialogs/SnackbarContainer";

import { Fn, Required } from "@utils/types";

export interface DialogInstance<TData> {
    id: string;
    resolverFn: Fn<DialogResult<TData>>;
    renderer: Fn<DialogProviderStates, React.ReactNode>;
    closing: boolean;
}

export interface DialogProviderProps {
    children: React.ReactNode;
    snackbarOptions?: SnackbarGlobalOptions;
}
export interface DialogProviderStates {
    instances: DialogInstance<any>[];
    backdropVisible: boolean;
    snackbars: SnackbarItem[];
}

class DialogProvider extends React.Component<DialogProviderProps, DialogProviderStates> {
    private readonly contextValues: DialogContextValue;
    public state: DialogProviderStates = {
        instances: [],
        backdropVisible: false,
        snackbars: [],
    };

    constructor(props: DialogProviderProps) {
        super(props);

        if (typeof props?.snackbarOptions?.maxItems === "number" && props.snackbarOptions.maxItems < 1) {
            throw new Error("Snackbar max items must be greater than 0");
        }

        this.contextValues = {
            showDialog: this.showDialog.bind(this),
            showBackdrop: this.showBackdrop.bind(this),
            hideBackdrop: this.hideBackdrop.bind(this),
            pushSnackbar: this.pushSnackbar.bind(this),
        };
    }

    private pushSnackbar = <TOptions extends SnackbarOptions>(
        options: TOptions,
    ): Promise<SnackbarInstance<TOptions["type"]>> => {
        return new Promise<SnackbarInstance<TOptions["type"]>>(res => {
            const id = shortid();

            this.setState(
                (prevStates: DialogProviderStates) => {
                    const maxItems = this.props.snackbarOptions?.maxItems ?? 3;
                    const newSnackbars = [...prevStates.snackbars];
                    if (newSnackbars.length >= maxItems) {
                        newSnackbars.pop();
                    }

                    return {
                        snackbars: [
                            {
                                id,
                                options,
                            },
                            ...newSnackbars,
                        ],
                    };
                },
                () => {
                    const instance: LoadingSnackbarInstance = {
                        close: this.closeSnackbar(id),
                        success: this.successSnackbar(id),
                        error: this.errorSnackbar(id),
                    };

                    res(instance);
                },
            );
        });
    };

    private closeSnackbar = (id: string) => {
        return () => {
            this.setState(({ snackbars }: DialogProviderStates) => ({
                snackbars: snackbars.filter(item => item.id !== id),
            }));
        };
    };
    private successSnackbar = (id: string) => {
        return (message: string) => {
            this.updateSnackbar(id, {
                type: "success",
                message,
            });
        };
    };
    private errorSnackbar = (id: string) => {
        return (message: string) => {
            this.updateSnackbar(id, {
                type: "error",
                message,
            });
        };
    };
    private handleRequestSnackbarClose = (item: SnackbarItem) => {
        this.closeSnackbar(item.id)();
    };

    private updateSnackbar = (id: string, options: Partial<SnackbarOptions>) => {
        const { snackbars } = this.state;
        const snackbar = snackbars.find(item => item.id === id);
        if (!snackbar) {
            throw new Error("Snackbar with id not found");
        }

        if (snackbar.options.type !== "loading") {
            throw new Error("Snackbar is not a loading snackbar");
        }

        this.setState((prevStates: DialogProviderStates) => ({
            snackbars: prevStates.snackbars.map(item => ({
                ...item,
                options: {
                    ...item.options,
                    ...options,
                },
            })),
        }));
    };

    private showDialog<TProps extends DialogPropBase<any>>(
        Component: React.ComponentType<TProps>,
        title: string,
        data?: Omit<TProps, keyof DialogPropBase<any>>,
    ) {
        return new Promise<DialogResult<Required<TProps["__data"]>>>(resolverFn => {
            const id = shortid();
            const handleClose: DialogPropBase<any>["onClose"] = result => {
                resolverFn(result);

                this.setState((prevStates: DialogProviderStates) => {
                    const { instances } = prevStates;

                    return {
                        instances: instances.map(item => ({
                            ...item,
                            closing: id === item.id,
                        })),
                    };
                });
            };

            const handleClosed = () => {
                this.setState((prevStates: DialogProviderStates) => ({
                    instances: prevStates.instances.filter(instance => instance.id !== id),
                }));
            };

            const renderer = ({ instances }: DialogProviderStates) => {
                const open = instances[0].id === id;
                const closing = instances.find(p => p.id === id)?.closing || false;
                const props = {
                    title,
                    open: open && !closing,
                    onClose: handleClose,
                    onClosed: handleClosed,
                } as TProps;

                return <Component key={id} {...props} {...data} />;
            };

            this.setState((prevStates: DialogProviderStates) => ({
                instances: [
                    ...prevStates.instances,
                    {
                        id,
                        resolverFn,
                        renderer,
                        closing: false,
                    },
                ],
            }));
        });
    }
    private showBackdrop() {
        this.setState({ backdropVisible: true });
    }
    private hideBackdrop() {
        this.setState({ backdropVisible: false });
    }

    private renderItems = (instance: DialogInstance<any>) => {
        return instance.renderer(this.state);
    };
    public render() {
        const { children, snackbarOptions } = this.props;
        const { instances, backdropVisible, snackbars } = this.state;

        return (
            <DialogContext.Provider value={this.contextValues}>
                {children}
                {instances.map(this.renderItems)}
                <Backdrop sx={{ zIndex: 3000, color: "#fff" }} open={backdropVisible}>
                    <CircularProgress color="inherit" />
                </Backdrop>
                <SnackbarContainer
                    requestClose={this.handleRequestSnackbarClose}
                    items={snackbars}
                    globalOptions={snackbarOptions}
                />
            </DialogContext.Provider>
        );
    }
}

export default DialogProvider;
