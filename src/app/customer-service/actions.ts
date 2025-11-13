
'use server';

import { apiFetch } from '@/lib/api-client';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

export type Reply = {
  _id: string;
  repliedBy: {
    name: string;
    role: 'user' | 'admin' | 'vendor' | 'superadmin';
  };
  replyText: string;
  repliedAt: string;
};

export type Ticket = {
  _id: string;
  subject: string;
  description: string;
  image?: string;
  status: 'open' | 'in_progress' | 'closed' | 'replied' | 'solved';
  createdAt: string;
  updatedAt: string;
  userType: 'user' | 'vendor';
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  replies: Reply[];
};

const TICKET_API_BASE = '/api/ticket';

// ===================================
// FETCH TICKETS
// ===================================
export async function getMyTickets(token: string): Promise<{ data: Ticket[] | null; error: string | null; }> {
  if (!token) {
    return { data: null, error: 'Authentication is required.' };
  }
  try {
    const result = await apiFetch(`${TICKET_API_BASE}/my-tickets`, token, { cache: 'no-store' });
    return { data: result.data?.tickets || [], error: null };
  } catch (e: any) {
    console.error('Error fetching tickets:', e.message);
    return { data: null, error: e.message };
  }
}

// ===================================
// GET SINGLE TICKET
// ===================================
export async function getSingleTicket(ticketId: string, token: string): Promise<{ data: Ticket | null; error: string | null; }> {
  if (!ticketId || !token) {
    return { data: null, error: 'Ticket ID and token are required.' };
  }
  try {
    const result = await apiFetch(`${TICKET_API_BASE}/singleticket/${ticketId}`, token, { cache: 'no-store' });
    return { data: result.data, error: null };
  } catch (e: any) {
    console.error(`Error fetching single ticket ${ticketId}:`, e.message);
    return { data: null, error: e.message };
  }
}

// ===================================
// CREATE TICKET
// ===================================
export type CreateTicketState = {
  errors?: {
    subject?: string[];
    description?: string[];
    image?: string[];
    server?: string[];
  };
  message?: string;
};

export async function createTicket(prevState: CreateTicketState, formData: FormData): Promise<CreateTicketState> {
  const token = formData.get('token') as string;
  if (!token) {
    return {
      errors: { server: ['Authentication required.'] },
      message: 'You must be logged in to create a ticket.',
    };
  }

  // No need for Zod here as we're passing FormData directly
  const subject = formData.get('subject') as string;
  const description = formData.get('description') as string;

  if (!subject || subject.trim().length < 5) {
    return { errors: { subject: ['Subject must be at least 5 characters.'] } };
  }
  if (!description || description.trim().length < 10) {
    return { errors: { description: ['Description must be at least 10 characters.'] } };
  }
  
  try {
    const result = await apiFetch(`${TICKET_API_BASE}/create`, token, {
      method: 'POST',
      body: formData,
    }, true); // isFormData = true

    if (!result.success) {
      throw new Error(result.message || 'Failed to create ticket.');
    }

    revalidatePath('/customer-service');
    return { message: 'Ticket created successfully!' };
  } catch (error) {
    const errorMessage = (error as Error).message;
    console.error('Error creating ticket:', errorMessage);
    return {
      errors: { server: [errorMessage] },
      message: `Failed to create ticket: ${errorMessage}`,
    };
  }
}

// ===================================
// UPDATE TICKET
// ===================================
const updateTicketSchema = z.object({
  subject: z.string().min(5, 'Subject must be at least 5 characters.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
});

export type UpdateTicketState = {
  errors?: z.ZodError<z.infer<typeof updateTicketSchema>>['formErrors']['fieldErrors'] & { server?: string[] };
  message?: string;
  success?: boolean;
};


export async function updateTicket(ticketId: string, prevState: UpdateTicketState, formData: FormData): Promise<UpdateTicketState> {
  const token = formData.get('token') as string;
  if (!token) {
    return { message: 'Authentication required.', success: false, errors: { server: ['You must be logged in.'] } };
  }
  
  const validatedFields = updateTicketSchema.safeParse({
    subject: formData.get('subject'),
    description: formData.get('description'),
  });

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  try {
    const result = await apiFetch(`${TICKET_API_BASE}/updateticket/${ticketId}`, token, {
      method: 'PUT',
      body: JSON.stringify(validatedFields.data),
    });

    if (!result.success) {
      throw new Error(result.message || 'Failed to update ticket.');
    }
    
    revalidatePath('/customer-service');
    return { success: true, message: 'Ticket updated successfully!' };
  } catch (error) {
    return { message: `Update failed: ${(error as Error).message}` };
  }
}


// ===================================
// DELETE TICKET
// ===================================
export async function deleteTicket(ticketId: string, token: string): Promise<{ success: boolean; message: string }> {
  if (!ticketId || !token) {
    return { success: false, message: 'Missing required parameters.' };
  }
  try {
    const result = await apiFetch(`${TICKET_API_BASE}/deleteticket/${ticketId}`, token, {
      method: 'DELETE',
    });
    if (!result.success) {
      throw new Error(result.message || 'Failed to delete ticket.');
    }
    revalidatePath('/customer-service');
    return { success: true, message: 'Ticket deleted successfully.' };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}

// ===================================
// REPLY TO TICKET (USER & ADMIN)
// ===================================
const replySchema = z.object({
  replyText: z.string().min(1, 'Reply cannot be empty.'),
});

export type ReplyState = {
  errors?: {
    replyText?: string[];
    server?: string[];
  };
  message?: string;
  success?: boolean;
};

export async function replyToTicket(ticketId: string, prevState: ReplyState, formData: FormData): Promise<ReplyState> {
  const token = formData.get('token') as string;
  if (!token) {
    return { success: false, message: 'Authentication required.', errors: { server: ['You must be logged in.'] } };
  }

  const validatedFields = replySchema.safeParse({
    replyText: formData.get('replyText'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await apiFetch(`/api/ticket/ownreply/${ticketId}/reply`, token, {
      method: 'POST',
      body: JSON.stringify(validatedFields.data),
    });

    if (!result.success) {
      throw new Error(result.message || 'Failed to post reply.');
    }

    revalidatePath(`/customer-service`);
    return { success: true, message: 'Reply added successfully!' };

  } catch (error) {
    const errorMessage = (error as Error).message;
    console.error('Error replying to ticket:', errorMessage);
    return {
      success: false,
      message: `Reply failed: ${errorMessage}`,
      errors: { server: [errorMessage] },
    };
  }
}


export async function adminReplyToTicket(ticketId: string, prevState: ReplyState, formData: FormData): Promise<ReplyState> {
  const token = formData.get('token') as string;
  if (!token) {
    return { success: false, message: 'Authentication required.', errors: { server: ['You must be logged in.'] } };
  }

  const validatedFields = replySchema.safeParse({
    replyText: formData.get('replyText'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await apiFetch(`/api/ticket/admin/${ticketId}/reply`, token, {
      method: 'POST',
      body: JSON.stringify(validatedFields.data),
    });

    if (!result.success) {
      throw new Error(result.message || 'Failed to post admin reply.');
    }

    revalidatePath(`/customer-service`);
    revalidatePath(`/super-admin/tickets`);
    return { success: true, message: 'Admin reply added successfully!' };

  } catch (error) {
    const errorMessage = (error as Error).message;
    console.error('Error in admin reply:', errorMessage);
    return {
      success: false,
      message: `Reply failed: ${errorMessage}`,
      errors: { server: [errorMessage] },
    };
  }
}

// ===================================
// MARK TICKET AS SOLVED (ADMIN)
// ===================================
export async function markTicketAsSolved(ticketId: string, token: string): Promise<{ success: boolean; message: string; }> {
    if (!ticketId || !token) {
        return { success: false, message: 'Ticket ID and token are required.' };
    }

    try {
        const result = await apiFetch(`${TICKET_API_BASE}/admin/${ticketId}/solve`, token, {
            method: 'PUT',
        });
        
        if (!result.success) {
            throw new Error(result.message || 'Failed to mark ticket as solved.');
        }

        revalidatePath('/super-admin/tickets');
        revalidatePath('/customer-service');
        return { success: true, message: result.message };

    } catch(e: any) {
        console.error('Error marking ticket as solved:', e.message);
        return { success: false, message: e.message };
    }
}
