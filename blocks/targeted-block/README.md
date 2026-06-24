# Targeted Block

Renders personalized content to authenticated users who belong to specific Adobe Commerce customer segments or customer groups. Non-matching visitors see only the optional background image (if configured); the headline and fragment content are gated.

## Configuration

Authored as a key-value table in DA.live, SharePoint, or Google Docs. All fields are optional unless otherwise noted.

| Field | Key in table | Description |
|---|---|---|
| Headline | `headline` | Text heading displayed to matching users above the fragment content |
| Background Image | `background image` | Image used as a CSS cover background on the block — visible to all |
| Customer Segment ID(s) | `customer segments` | Comma-separated Adobe Commerce segment IDs (e.g. `1, 2, 3`) |
| Customer Group ID(s) | `customer groups` | Comma-separated Adobe Commerce customer group IDs (e.g. `1, 2`) |
| Type | `type` | Personalization matching type (e.g. `segment`) |
| Fragment Path | `fragment` | Path to the DA/SharePoint content fragment shown to matched users |

## Behavior

- **Background image**: Applied as a CSS `background-image` to the block element. Visible to all users regardless of authentication state.
- **Headline + fragment content**: Rendered inside the `TargetedBlock` dropin's Content slot. Only displayed when the authenticated user matches at least one of the configured segment or group IDs.
- **Unauthenticated / non-matching users**: The block collapses to just the background image with no visible text.

## Dependencies

Requires the `@dropins/storefront-personalization` dropin, initialized via `scripts/commerce.js`.

## DA.live Table Format

| Targeted Block | |
|---|---|
| headline | Exclusive member savings — 30% off |
| background image | *(authored image)* |
| customer segments | 1, 2 |
| customer groups | 3 |
| type | segment |
| fragment | /fragments/member-offer |
