# Install GitHub CLI if needed
gh auth login
# Create secrets from your .env files
gh secret set --env-file frontend/.env
gh secret set --env-file backend/.env