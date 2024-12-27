import React, { useEffect } from 'react';
import { Box } from '@chakra-ui/react';

declare global {
    interface Window {
        KKIAPAY_INSTANCE: any;
    }
}

interface KKiapayCheckoutProps {
    amount: number;
    callback: (response: any) => void;
    vendorId: string;
}

export const KKiapayCheckout: React.FC<KKiapayCheckoutProps> = ({ amount, callback, vendorId }) => {
    useEffect(() => {
        // Charger le script KKiaPay
        const script = document.createElement('script');
        script.src = 'https://cdn.kkiapay.me/k.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            // Ne pas supprimer le script pour éviter les problèmes de rechargement
        };
    }, []);

    return (
        <Box width="full">
            <kkiapay-widget
                amount={amount.toString()}
                key={vendorId}
                callback="https://kkiapay-redirect.com"
                style={{
                    backgroundColor: '#4299E1',
                    color: 'white',
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    width: '100%',
                    textAlign: 'center',
                    fontSize: '1.125rem',
                    fontWeight: 'bold',
                }}
            >
                Proceed to Checkout
            </kkiapay-widget>
        </Box>
    );
};
