# Aster Digital administration

Open `/admin` and sign in. Local development access details, if bootstrapped, are in the ignored `.local/admin-access.txt` file. Production accounts must be created with your own email and a unique password through the seed command.

- **Dashboard:** enquiries received over the last seven days, published services, confirmed subscribers, and queued delivery counts. Revenue totals stay separated by currency and status. Monthly bars use the payment date and show the current calendar year.
- **Leads:** filter by status, exact service name, and inclusive date range. View the full enquiry, update status and internal notes. Delete hides a lead from the inbox; permanent erasure is a separate data request procedure.
- **Services:** create and edit names, summaries, deliverables, group, publication state and display order. Existing URL slugs are seeded unchanged. Changing a slug changes its URL. Remove unpublishes; it does not destroy the record. New services get a generic detail page using their saved content. Public pages read current data on page load.
- **Revenue:** enter an exact amount, currency, invoice date and status. Paid records require a payment date. A related lead ID is optional and must refer to an existing lead. This records revenue; it does not charge a customer or generate an invoice.
- **Newsletter:** confirmed subscribers are distinguished from pending and unsubscribed records. New signups receive a 24-hour confirmation link. Unsubscribe is immediate and invalidates pending confirmation links.
- **Exports:** CSV exports retrieve all matching records in bounded pages of 100. Lead filters are preserved. Spreadsheet formula characters are escaped. Avoid editing records while exporting a large result set. Keep downloaded files private and delete them when no longer needed.
- **Settings:** edit contact details, public pixel IDs, Google Ads conversion ID/label and consent copy. Server secrets show only configured/not configured. They must be changed in the API environment. Password changes revoke all sessions.
- **Audit log:** records admin actions without storing passwords or full lead content.

If a delivery fails, the enquiry remains saved. The worker retries up to 12 times with increasing delay. The dashboard shows failed deliveries. An operator should fix credentials/provider errors and explicitly reset failed jobs as described in the runbook.
