import { Polar } from '@polar-sh/sdk';
import { config } from '../config';

const polar = new Polar({
  accessToken: config.polarAccessToken,
});

export class BillingService {
  /**
   * Creates a checkout session for a user.
   */
  static async createCheckoutSession(userId: string, productId: string, successUrl: string) {
    try {
      if (!config.polarAccessToken) {
        console.warn('POLAR_ACCESS_TOKEN not set, returning dummy checkout URL');
        return 'https://polar.sh/dummy-checkout';
      }

      // Placeholder: Note that productId must match a real product id in your Polar store
      // Creates a checkout session
      const checkout = await polar.checkouts.create({
        products: [productId],
        successUrl,
      });

      return checkout.url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  }
}
