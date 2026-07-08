import re

def fix(path, replacements):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    for old, new in replacements:
        content = content.replace(old, new)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

base = "D:/Coding/SIMPATIK/resources/js/Pages/"

# 1. DirectForm.tsx (remove usePage)
fix(base + "Outbound/DirectForm.tsx", [
    ("import { Head, Link, useForm, usePage }", "import { Head, Link, useForm }")
])

# 2. Outbound/Index.tsx (outline -> secondary)
fix(base + "Outbound/Index.tsx", [
    ('variant="outline"', 'variant="secondary"')
])

# 3. Reports/Department.tsx (outline -> secondary, unused period)
fix(base + "Reports/Department.tsx", [
    ('variant="outline"', 'variant="secondary"'),
    ("const { items, period } = reportData;", "const { items } = reportData;")
])

# 4. Reports/Reconciliation.tsx
fix(base + "Reports/Reconciliation.tsx", [
    ('variant="outline"', 'variant="secondary"')
])

# 5. User/Index.tsx
fix(base + "User/Index.tsx", [
    ('variant="outline"', 'variant="secondary"')
])

# 6. Auth/Login.tsx
fix(base + "Auth/Login.tsx", [
    ('bg-gradient-to-br', 'bg-linear-to-br')
])

# 7. Error.tsx
fix(base + "Error.tsx", [
    ('bg-gradient-to-br', 'bg-linear-to-br')
])

# 8. Inbound/Form.tsx
fix(base + "Inbound/Form.tsx", [
    ('!text-sm', 'text-sm!')
])

# 9. Outbound/Form.tsx
fix(base + "Outbound/Form.tsx", [
    ("import { PageHeader, Button, Combobox, Breadcrumbs, Textarea, Label, DatePicker } from '../../Components/UI';", "import { PageHeader, Button, Breadcrumbs, Textarea, Label, DatePicker } from '../../Components/UI';"),
    ("import { ComboboxOption } from '../../Components/UI/Combobox';\n", ""),
    ("export default function OutboundForm({ items, departments, nextDocument, outbound }: Props) {", "export default function OutboundForm({ items, nextDocument, outbound }: Props) {"),
    ('!text-sm', 'text-sm!')
])

# 10. Outbound/Show.tsx
fix(base + "Outbound/Show.tsx", [
    ('flex-shrink-0', 'shrink-0')
])

# 11. User/Show.tsx
fix(base + "User/Show.tsx", [
    ('import { ArrowLeft, Pencil, Power, Mail, Building2, Shield, Calendar, FileSignature }', 'import { ArrowLeft, Pencil, Power, Mail, Building2, Shield, Calendar }'),
    ('bg-gradient-to-br', 'bg-linear-to-br')
])

print("Fixes applied.")
