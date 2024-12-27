declare namespace JSX {
    interface IntrinsicElements {
        'kkiapay-widget': {
            amount: string;
            key: string;
            position: string;
            sandbox: string;
            data: string;
            theme: string;
            callback: string;
            style?: React.CSSProperties;
            children?: React.ReactNode;
        };
    }
}
