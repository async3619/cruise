import React from "react";
import shortid from "shortid";

import { Backdrop, CircularProgress } from "@mui/material";

import { DialogContext, DialogContextValue, DialogPropBase, DialogResult } from "@dialogs";
import { Fn, Required } from "@utils/types";

export interface DialogInstance<TData> {
    id: string;
    resolverFn: Fn<DialogResult<TData>>;
    renderer: Fn<DialogProviderStates, React.ReactNode>;
    closing: boolean;
}

export interface DialogProviderProps {
    children: React.ReactNode;
}
export interface DialogProviderStates {
    instances: DialogInstance<any>[];
    backdropVisible: boolean;
}

export default class DialogProvider extends React.Component<DialogProviderProps, DialogProviderStates> {
    private readonly contextValues: DialogContextValue;
    public state: DialogProviderStates = {
        instances: [],
        backdropVisible: false,
    };

    constructor(props: DialogProviderProps) {
        super(props);

        this.contextValues = {
            showDialog: this.showDialog.bind(this),
            showBackdrop: this.showBackdrop.bind(this),
            hideBackdrop: this.hideBackdrop.bind(this),
        };
    }

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
        const { children } = this.props;
        const { instances, backdropVisible } = this.state;

        return (
            <DialogContext.Provider value={this.contextValues}>
                {children}
                {instances.map(this.renderItems)}
                <Backdrop sx={{ zIndex: 3000, color: "#fff" }} open={backdropVisible}>
                    <CircularProgress color="inherit" />
                </Backdrop>
            </DialogContext.Provider>
        );
    }
}
