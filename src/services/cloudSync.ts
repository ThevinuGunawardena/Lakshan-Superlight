import { getSupabase } from './supabaseClient';
import { StorageService } from './storage';

export const CloudSyncService = {
  isConfigured: () => {
    return getSupabase() !== null;
  },

  /**
   * Pull all records from Supabase cloud database down into local storage.
   */
  pullFromCloud: async (): Promise<{ success: boolean; count: number; error?: string }> => {
    const supabase = getSupabase();
    if (!supabase) {
      return { success: false, count: 0, error: 'Supabase is not configured.' };
    }

    try {
      let totalSynced = 0;

      // 1. Company Info
      const { data: comp } = await supabase.from('lsl_company_info').select('*').eq('id', 'default').maybeSingle();
      if (comp) {
        StorageService.saveCompanyInfo({
          name: comp.name || '',
          tagline: comp.tagline || '',
          address: comp.address || '',
          phone1: comp.phone1 || '',
          phone2: comp.phone2 || '',
          whatsapp: comp.whatsapp || '',
          email: comp.email || '',
          bankName: comp.bank_name || '',
          bankBranch: comp.bank_branch || '',
          accountNumber: comp.account_number || '',
          accountHolder: comp.account_holder || '',
          terms: comp.terms || []
        });
        totalSynced++;
      }

      // 2. Rental Items
      const { data: rentals } = await supabase.from('lsl_rental_items').select('*');
      if (rentals && rentals.length > 0) {
        StorageService.saveRentalItems(rentals.map(r => ({
          id: r.id,
          name: r.name,
          category: r.category,
          totalQuantity: r.total_quantity,
          maintenanceQty: r.maintenance_qty,
          dailyRate: Number(r.daily_rate),
          replacementCost: Number(r.replacement_cost),
          imageUrl: r.image_url,
          specs: r.specs
        })));
        totalSynced += rentals.length;
      }

      // 3. Retail Items
      const { data: retails } = await supabase.from('lsl_retail_items').select('*');
      if (retails && retails.length > 0) {
        StorageService.saveRetailItems(retails.map(r => ({
          id: r.id,
          sku: r.sku,
          name: r.name,
          category: r.category,
          unit: r.unit,
          unitCost: Number(r.unit_cost),
          retailPrice: Number(r.retail_price),
          stockQty: r.stock_qty,
          minAlertQty: r.min_alert_qty
        })));
        totalSynced += retails.length;
      }

      // 4. Bookings
      const { data: bookings } = await supabase.from('lsl_bookings').select('*');
      if (bookings && bookings.length > 0) {
        StorageService.saveBookings(bookings.map(b => ({
          id: b.id,
          bookingNumber: b.booking_number,
          customerName: b.customer_name,
          customerPhone: b.customer_phone,
          customerEmail: b.customer_email,
          customerAddress: b.customer_address,
          eventTitle: b.event_title,
          eventVenue: b.event_venue,
          eventStartDate: b.event_start_date,
          eventEndDate: b.event_end_date,
          activeEventDays: b.active_event_days,
          setupDaysPrior: b.setup_days_prior,
          dismantleDaysAfter: b.dismantle_days_after,
          blockedStartDate: b.blocked_start_date,
          blockedEndDate: b.blocked_end_date,
          status: b.status,
          items: b.items || [],
          equipmentTotal: Number(b.equipment_total),
          transportCrewFee: Number(b.transport_crew_fee),
          securityDeposit: Number(b.security_deposit),
          discount: Number(b.discount),
          netTotal: Number(b.net_total),
          advancePaid: Number(b.advance_paid),
          balanceDue: Number(b.balance_due),
          paymentMethod: b.payment_method,
          notes: b.notes,
          createdAt: b.created_at
        })));
        totalSynced += bookings.length;
      }

      // 5. Quotations
      const { data: quotes } = await supabase.from('lsl_quotations').select('*');
      if (quotes && quotes.length > 0) {
        StorageService.saveQuotations(quotes.map(q => ({
          id: q.id,
          quoteNumber: q.quote_number,
          customerName: q.customer_name,
          customerPhone: q.customer_phone,
          customerEmail: q.customer_email,
          customerAddress: q.customer_address,
          eventTitle: q.event_title,
          eventVenue: q.event_venue,
          eventStartDate: q.event_start_date,
          eventEndDate: q.event_end_date,
          setupDaysPrior: q.setup_days_prior,
          dismantleDaysAfter: q.dismantle_days_after,
          items: q.items || [],
          equipmentTotal: Number(q.equipment_total),
          transportCrewFee: Number(q.transport_crew_fee),
          securityDeposit: Number(q.security_deposit),
          discount: Number(q.discount),
          grandTotal: Number(q.grand_total),
          status: q.status,
          convertedBookingId: q.converted_booking_id,
          notes: q.notes,
          validUntil: q.valid_until,
          createdAt: q.created_at
        })));
        totalSynced += quotes.length;
      }

      // 6. Light Wal Orders
      const { data: lwOrders } = await supabase.from('lsl_light_wal_orders').select('*');
      if (lwOrders && lwOrders.length > 0) {
        StorageService.saveLightWalOrders(lwOrders.map(o => ({
          id: o.id,
          orderNumber: o.order_number,
          customerName: o.customer_name,
          customerPhone: o.customer_phone,
          customerAddress: o.customer_address,
          deliveryDate: o.delivery_date,
          lengthValue: Number(o.length_value),
          lengthUnit: o.length_unit,
          bulbSpacingInches: o.bulb_spacing_inches,
          calculatedBulbCount: o.calculated_bulb_count,
          bulbType: o.bulb_type,
          wireType: o.wire_type,
          plugType: o.plug_type,
          controllerIncluded: o.controller_included,
          controllerType: o.controller_type,
          pricingMode: o.pricing_mode,
          ratePerUnit: Number(o.rate_per_unit),
          accessoriesFee: Number(o.accessories_fee),
          discount: Number(o.discount),
          grandTotal: Number(o.grand_total),
          advancePaid: Number(o.advance_paid),
          balanceDue: Number(o.balance_due),
          status: o.status,
          workshopNotes: o.workshop_notes,
          createdAt: o.created_at
        })));
        totalSynced += lwOrders.length;
      }

      // 7. POS Transactions
      const { data: txs } = await supabase.from('lsl_pos_transactions').select('*');
      if (txs && txs.length > 0) {
        StorageService.savePOSTransactions(txs.map(t => ({
          id: t.id,
          receiptNumber: t.receipt_number,
          date: t.date,
          customerName: t.customer_name,
          customerPhone: t.customer_phone,
          items: t.items || [],
          subtotal: Number(t.subtotal),
          discount: Number(t.discount),
          netTotal: Number(t.net_total),
          amountPaid: Number(t.amount_paid),
          changeGiven: Number(t.change_given),
          paymentMethod: t.payment_method,
          cashierName: t.cashier_name
        })));
        totalSynced += txs.length;
      }

      return { success: true, count: totalSynced };
    } catch (err: any) {
      console.error('Cloud pull failed:', err);
      return { success: false, count: 0, error: err?.message || 'Failed to pull data from cloud' };
    }
  },

  /**
   * Push all current local data up to Supabase cloud database.
   */
  pushToCloud: async (): Promise<{ success: boolean; message: string }> => {
    const supabase = getSupabase();
    if (!supabase) {
      return { success: false, message: 'Supabase is not configured.' };
    }

    try {
      // 1. Company Info
      const comp = StorageService.getCompanyInfo();
      await supabase.from('lsl_company_info').upsert({
        id: 'default',
        name: comp.name,
        tagline: comp.tagline,
        address: comp.address,
        phone1: comp.phone1,
        phone2: comp.phone2,
        whatsapp: comp.whatsapp,
        email: comp.email,
        bank_name: comp.bankName,
        bank_branch: comp.bankBranch,
        account_number: comp.accountNumber,
        account_holder: comp.accountHolder,
        terms: comp.terms
      });

      // 2. Rental Items
      const rentals = StorageService.getRentalItems();
      if (rentals.length > 0) {
        await supabase.from('lsl_rental_items').upsert(rentals.map(r => ({
          id: r.id,
          name: r.name,
          category: r.category,
          total_quantity: r.totalQuantity,
          maintenance_qty: r.maintenanceQty,
          daily_rate: r.dailyRate,
          replacement_cost: r.replacementCost,
          image_url: r.imageUrl,
          specs: r.specs
        })));
      }

      // 3. Retail Items
      const retails = StorageService.getRetailItems();
      if (retails.length > 0) {
        await supabase.from('lsl_retail_items').upsert(retails.map(r => ({
          id: r.id,
          sku: r.sku,
          name: r.name,
          category: r.category,
          unit: r.unit,
          unit_cost: r.unitCost,
          retail_price: r.retailPrice,
          stock_qty: r.stockQty,
          min_alert_qty: r.minAlertQty
        })));
      }

      // 4. Bookings
      const bookings = StorageService.getBookings();
      if (bookings.length > 0) {
        await supabase.from('lsl_bookings').upsert(bookings.map(b => ({
          id: b.id,
          booking_number: b.bookingNumber,
          customer_name: b.customerName,
          customer_phone: b.customerPhone,
          customer_email: b.customerEmail,
          customer_address: b.customerAddress,
          event_title: b.eventTitle,
          event_venue: b.eventVenue,
          event_start_date: b.eventStartDate,
          event_end_date: b.eventEndDate,
          active_event_days: b.activeEventDays,
          setup_days_prior: b.setupDaysPrior,
          dismantle_days_after: b.dismantleDaysAfter,
          blocked_start_date: b.blockedStartDate,
          blocked_end_date: b.blockedEndDate,
          status: b.status,
          items: b.items,
          equipment_total: b.equipmentTotal,
          transport_crew_fee: b.transportCrewFee,
          security_deposit: b.securityDeposit,
          discount: b.discount,
          net_total: b.netTotal,
          advance_paid: b.advancePaid,
          balance_due: b.balanceDue,
          payment_method: b.paymentMethod,
          notes: b.notes,
          created_at: b.createdAt
        })));
      }

      // 5. Quotations
      const quotes = StorageService.getQuotations();
      if (quotes.length > 0) {
        await supabase.from('lsl_quotations').upsert(quotes.map(q => ({
          id: q.id,
          quote_number: q.quoteNumber,
          customer_name: q.customerName,
          customer_phone: q.customerPhone,
          customer_email: q.customerEmail,
          customer_address: q.customerAddress,
          event_title: q.eventTitle,
          event_venue: q.eventVenue,
          event_start_date: q.eventStartDate,
          event_end_date: q.eventEndDate,
          setup_days_prior: q.setupDaysPrior,
          dismantle_days_after: q.dismantleDaysAfter,
          items: q.items,
          equipment_total: q.equipmentTotal,
          transport_crew_fee: q.transportCrewFee,
          security_deposit: q.securityDeposit,
          discount: q.discount,
          grand_total: q.grandTotal,
          status: q.status,
          converted_booking_id: q.convertedBookingId,
          notes: q.notes,
          valid_until: q.validUntil,
          created_at: q.createdAt
        })));
      }

      // 6. Light Wal Orders
      const lwOrders = StorageService.getLightWalOrders();
      if (lwOrders.length > 0) {
        await supabase.from('lsl_light_wal_orders').upsert(lwOrders.map(o => ({
          id: o.id,
          order_number: o.orderNumber,
          customer_name: o.customerName,
          customer_phone: o.customerPhone,
          customer_address: o.customerAddress,
          delivery_date: o.deliveryDate,
          length_value: o.lengthValue,
          length_unit: o.lengthUnit,
          bulb_spacing_inches: o.bulbSpacingInches,
          calculated_bulb_count: o.calculatedBulbCount,
          bulb_type: o.bulbType,
          wire_type: o.wireType,
          plug_type: o.plugType,
          controller_included: o.controllerIncluded,
          controller_type: o.controllerType,
          pricing_mode: o.pricingMode,
          rate_per_unit: o.ratePerUnit,
          accessories_fee: o.accessoriesFee,
          discount: o.discount,
          grand_total: o.grandTotal,
          advance_paid: o.advancePaid,
          balance_due: o.balanceDue,
          status: o.status,
          workshop_notes: o.workshopNotes,
          created_at: o.createdAt
        })));
      }

      // 7. POS Transactions
      const txs = StorageService.getPOSTransactions();
      if (txs.length > 0) {
        await supabase.from('lsl_pos_transactions').upsert(txs.map(t => ({
          id: t.id,
          receipt_number: t.receiptNumber,
          date: t.date,
          customer_name: t.customerName,
          customer_phone: t.customerPhone,
          items: t.items,
          subtotal: t.subtotal,
          discount: t.discount,
          net_total: t.netTotal,
          amount_paid: t.amountPaid,
          change_given: t.changeGiven,
          payment_method: t.paymentMethod,
          cashier_name: t.cashierName
        })));
      }

      return { success: true, message: 'All local records uploaded and synchronized to Supabase cloud database!' };
    } catch (err: any) {
      console.error('Cloud push failed:', err);
      return { success: false, message: err?.message || 'Failed to upload records to cloud' };
    }
  }
};
