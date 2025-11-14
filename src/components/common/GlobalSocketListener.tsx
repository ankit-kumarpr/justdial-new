
'use client';

import { useState, useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { LeadNotificationPopup } from './LeadNotificationPopup';
import { createLeadPaymentOrder, verifyLeadPayment } from '@/app/vendor-leads/actions';

type LeadData = {
    _id: string;
    searchKeyword: string;
    description: string;
    userLocation: { city: string };
    createdAt: string;
};

type LeadResponseData = {
    _id: string;
    status: string;
};

type SocketLeadData = {
    lead: LeadData;
    leadResponse: LeadResponseData;
};

export function GlobalSocketListener() {
    const { toast } = useToast();
    const router = useRouter();
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isVendor, setIsVendor] = useState(false);
    const [currentLead, setCurrentLead] = useState<SocketLeadData | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        const user = localStorage.getItem('user');

        if (token && user) {
            try {
                const parsedUser = JSON.parse(user);
                if (parsedUser.role === 'vendor') {
                    setIsVendor(true);
                }
            } catch (e) { console.error("Could not parse user from storage", e); }
        } else {
            setIsVendor(false);
        }
    }, []);

    const onNewLead = useCallback((data: SocketLeadData) => {
        if (data && data.lead && data.leadResponse) {
            setCurrentLead(data);
        } else {
            console.error("Received malformed new_lead data", data);
        }
    }, []);

    useEffect(() => {
        if (!isVendor) {
            if(socket) socket.disconnect();
            return;
        };

        const token = localStorage.getItem('accessToken');
        const newSocket = io("https://mytestbackend-wq48.onrender.com", {
            auth: { token },
            transports: ["websocket"],
        });
        setSocket(newSocket);
        
        newSocket.on('connect', () => console.log("✅ Global socket connected"));
        newSocket.on('new_lead', onNewLead);

        return () => {
            newSocket.off('connect');
            newSocket.off('new_lead', onNewLead);
            newSocket.disconnect();
            setSocket(null);
        };
    }, [isVendor, onNewLead]);
    
    const handleAccept = async () => {
        if (!currentLead) return;
        
        const leadResponseId = currentLead.leadResponse._id;
        const token = localStorage.getItem('accessToken');
        const userJson = localStorage.getItem('user');
    
        if (!token || !userJson) {
          toast({ title: 'Auth Error', description: 'Please log in.', variant: 'destructive' });
          router.push('/login');
          return;
        }
        
        const user = JSON.parse(userJson);
    
        try {
            const { order, error } = await createLeadPaymentOrder(leadResponseId, token);
            if (error || !order) {
                throw new Error(error || "Failed to create payment order.");
            }
    
            const options = {
                key: order.razorpayKeyId,
                amount: order.amount,
                currency: order.currency,
                name: "Gnetdial Lead Acceptance",
                description: `Payment for lead: ${order.leadDetails.keyword}`,
                order_id: order.orderId,
                handler: async (response: any) => {
                    const verificationResult = await verifyLeadPayment(leadResponseId, response.razorpay_order_id, response.razorpay_payment_id, response.razorpay_signature, token);
                    if (verificationResult.success) {
                        toast({ title: "Lead Accepted!", description: verificationResult.message });
                        if(socket) socket.emit("lead_accepted", { leadResponseId });
                        setCurrentLead(null);
                        router.push('/vendor-leads');
                    } else {
                         toast({ title: "Payment Failed", description: verificationResult.message, variant: "destructive" });
                    }
                },
                prefill: { name: user.name, email: user.email, contact: user.phone },
                theme: { color: "#3399cc" }
            };
            
            const rzp1 = new window.Razorpay(options);
            rzp1.on('payment.failed', (response: any) => toast({ title: "Payment Failed", description: response.error.description, variant: "destructive" }));
            rzp1.open();
    
        } catch (e) {
            toast({ title: "Error", description: (e as Error).message, variant: "destructive" });
        }
    };

    const handleReject = () => {
        if(socket && currentLead) {
             socket.emit('lead_rejected', { leadResponseId: currentLead.leadResponse._id });
        }
        toast({ title: 'Lead Rejected', description: 'You have rejected the lead.' });
        setCurrentLead(null);
    };

    if (!isVendor) return null;

    return (
        <LeadNotificationPopup
            lead={currentLead?.lead || null}
            onClose={() => setCurrentLead(null)}
            onAccept={handleAccept}
            onReject={handleReject}
        />
    );
}
