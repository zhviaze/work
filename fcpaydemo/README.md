# FC Pay JPYC Payment Demo

Interactive web demo for the FC Pay payment flow:

- FC Pay opens a JPYC payment request.
- FC Pay calls HashPort Wallet through WalletConnect.
- The user reviews and signs the payment in the phone UI.
- A JPYC Transfer is broadcast on Ethereum.
- FC Pay receives Webhook confirmation and marks the order as paid.

## Files

- `index.html` - standalone demo page with Japanese / English language toggle.
- `google-sites-embed-code.txt` - iframe code for Google Sites.
- `google-sites-embed-code.html` - readable helper page containing the same embed code.

## GitHub Pages

If GitHub Pages is enabled for this repository, the demo can be opened at:

`https://zhviaze.github.io/work/fcpaydemo/`
