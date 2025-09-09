/**
 * Donor service for API communication
 */

export interface Donor {
  id: number;
  first_name: string;
  last_name: string;
  full_name?: string;
  email?: string;
  phone?: string;
  city?: string;
  state?: string;
  company?: string;
  donor_status: string;
  donor_type: string;
  total_gifts: number;
  total_gift_count: number;
  created_at: string;
}

export interface DonorCreate {
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  mobile_phone?: string;
  work_phone?: string;
  address_line_1?: string;
  address_line_2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  company?: string;
  job_title?: string;
  preferred_contact_method?: string;
  do_not_email?: boolean;
  do_not_call?: boolean;
  do_not_mail?: boolean;
  donor_type?: string;
  notes?: string;
  source?: string;
}

export interface DonorUpdate extends Partial<DonorCreate> {
  preferred_name?: string;
  title?: string;
  suffix?: string;
  donor_status?: string;
  wealth_rating?: string;
  capacity_rating?: number;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class DonorService {
  private baseUrl = `${API_BASE_URL}/api/v1/donors`;

  async createDonor(donor: DonorCreate): Promise<Donor> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(donor),
    });

    if (!response.ok) {
      throw new Error(`Failed to create donor: ${response.statusText}`);
    }

    return response.json();
  }

  async getDonors(skip = 0, limit = 100): Promise<Donor[]> {
    const url = new URL(this.baseUrl);
    url.searchParams.append('skip', skip.toString());
    url.searchParams.append('limit', limit.toString());

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`Failed to fetch donors: ${response.statusText}`);
    }

    return response.json();
  }

  async getDonor(id: number): Promise<Donor> {
    const response = await fetch(`${this.baseUrl}/${id}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch donor: ${response.statusText}`);
    }

    return response.json();
  }

  async updateDonor(id: number, updates: DonorUpdate): Promise<Donor> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error(`Failed to update donor: ${response.statusText}`);
    }

    return response.json();
  }

  async searchDonors(query: string, limit = 50): Promise<Donor[]> {
    const url = new URL(`${this.baseUrl}/search`);
    url.searchParams.append('q', query);
    url.searchParams.append('limit', limit.toString());

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`Failed to search donors: ${response.statusText}`);
    }

    return response.json();
  }

  async findDuplicates(donorId: number): Promise<Donor[]> {
    const response = await fetch(`${this.baseUrl}/${donorId}/duplicates`);

    if (!response.ok) {
      throw new Error(`Failed to find duplicates: ${response.statusText}`);
    }

    return response.json();
  }

  async mergeDonors(primaryId: number, duplicateId: number): Promise<Donor> {
    const response = await fetch(`${this.baseUrl}/merge`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        primary_donor_id: primaryId,
        duplicate_donor_id: duplicateId,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to merge donors: ${response.statusText}`);
    }

    return response.json();
  }

  async addTag(donorId: number, tagName: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${donorId}/tags`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tag_name: tagName }),
    });

    if (!response.ok) {
      throw new Error(`Failed to add tag: ${response.statusText}`);
    }
  }

  async deleteDonor(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete donor: ${response.statusText}`);
    }
  }
}

export const donorService = new DonorService();

// Explicit re-exports to ensure proper module loading
export type { Donor, DonorCreate, DonorUpdate };