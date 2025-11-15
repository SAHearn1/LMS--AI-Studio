# Quick Reference Guide

## 📦 Installation

```bash
npm install @lms/ui react react-dom
```

## 🎨 Components at a Glance

| Component | Variants | Key Features |
|-----------|----------|--------------|
| **Button** | 6 variants, 4 sizes | Loading state, disabled, icon support |
| **Input** | - | Error states, icons (left/right), all input types |
| **Select** | - | Groups, labels, keyboard nav, accessible |
| **Card** | - | Header, Footer, Title, Description, Content |
| **Dialog** | - | Modal, overlay, focus trap, animations |
| **Table** | - | Sortable headers, pagination, responsive |
| **Form** | - | RHF + Zod integration, error handling |
| **Toast** | 3 variants | Auto-dismiss, actions, queue management |
| **Progress** | Linear, Circular, Spinner | Animated, accessible |
| **Skeleton** | 4 presets | Text, Card, Avatar, Button |
| **Label** | - | Form labels, accessible |
| **ThemeProvider** | - | Dark mode, system preference |

## 🚀 Quick Start

### Basic Setup

```tsx
import { ThemeProvider } from '@lms/ui';

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {/* Your app */}
    </ThemeProvider>
  );
}
```

### Button Example

```tsx
import { Button } from '@lms/ui';

<Button variant="default" size="default">
  Click me
</Button>

<Button variant="destructive" loading>
  Deleting...
</Button>
```

### Input with Error

```tsx
import { Input } from '@lms/ui';
import { Search } from 'lucide-react';

<Input 
  placeholder="Search..." 
  icon={<Search className="h-4 w-4" />}
  iconPosition="left"
  error="Required field"
  id="search"
/>
```

### Select/Dropdown

```tsx
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@lms/ui';

<Select>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="Select option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="1">Option 1</SelectItem>
    <SelectItem value="2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

### Card Layout

```tsx
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardContent,
  CardFooter 
} from '@lms/ui';

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
  <CardFooter>
    {/* Footer actions */}
  </CardFooter>
</Card>
```

### Dialog/Modal

```tsx
import { 
  Dialog, 
  DialogContent, 
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Button
} from '@lms/ui';

<Dialog>
  <DialogTrigger asChild>
    <Button>Open</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
    {/* Content */}
    <DialogFooter>
      <Button variant="outline">Cancel</Button>
      <Button>Confirm</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Table with Sorting

```tsx
import { 
  Table, 
  TableHeader, 
  TableBody,
  TableRow,
  TableHead,
  TableCell 
} from '@lms/ui';

<Table>
  <TableHeader>
    <TableRow>
      <TableHead sortable sortDirection="asc" onSort={handleSort}>
        Name
      </TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Data</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### Form with Validation

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Input,
  Button
} from '@lms/ui';

const schema = z.object({
  email: z.string().email(),
});

function MyForm() {
  const form = useForm({
    resolver: zodResolver(schema),
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(console.log)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
```

### Toast Notifications

```tsx
import { useToast, Toaster } from '@lms/ui';

function MyComponent() {
  const { toast } = useToast();

  return (
    <>
      <Button
        onClick={() => {
          toast({
            title: 'Success',
            description: 'Operation completed!',
            variant: 'success',
          });
        }}
      >
        Show Toast
      </Button>
      <Toaster />
    </>
  );
}
```

### Loading States

```tsx
import { 
  Skeleton, 
  SkeletonText, 
  SkeletonCard,
  Progress,
  CircularProgress,
  Spinner 
} from '@lms/ui';

// Skeleton
<Skeleton className="h-12 w-12 rounded-full" />
<SkeletonText lines={3} />
<SkeletonCard />

// Progress
<Progress value={60} />
<CircularProgress value={75} showValue />
<Spinner size="md" />
```

## 🎯 Import Patterns

```tsx
// Individual imports (tree-shakeable)
import { Button, Input, Card } from '@lms/ui';

// Hook
import { useToast } from '@lms/ui';

// Utility
import { cn } from '@lms/ui';
```

## 🌗 Dark Mode

```tsx
import { useTheme } from 'next-themes';
import { Button } from '@lms/ui';

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  
  return (
    <Button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      Toggle Theme
    </Button>
  );
}
```

## 📝 TypeScript

All components are fully typed. Hover over components in your IDE for prop documentation.

```tsx
import { ButtonProps } from '@lms/ui';

const MyButton: React.FC<ButtonProps> = (props) => {
  return <Button {...props} />;
};
```

## 🔧 Customization

### Using className

```tsx
<Button className="bg-blue-500 hover:bg-blue-600">
  Custom Button
</Button>
```

### Using cn utility

```tsx
import { cn } from '@lms/ui';

<div className={cn(
  'base-classes',
  condition && 'conditional-classes',
  className
)} />
```

## 📚 More Information

- **Full Documentation**: See README.md
- **Examples**: See EXAMPLES.md
- **Architecture**: See ARCHITECTURE.md
- **Component API**: Run `npm run storybook`

## 🛠️ Development

```bash
# Install dependencies
npm install

# Build package
npm run build

# Start Storybook
npm run storybook

# Development mode
npm run dev
```

## 🎨 Customization Guide

### Tailwind Config

Add to your `tailwind.config.js`:

```js
module.exports = {
  content: [
    './node_modules/@lms/ui/**/*.{js,ts,jsx,tsx}',
    // your other paths
  ],
  darkMode: 'class',
};
```

### Color Scheme

Components use Tailwind's default slate colors. Customize in your Tailwind config:

```js
theme: {
  extend: {
    colors: {
      // Your custom colors
    },
  },
}
```

## 🎯 Best Practices

1. **Always wrap app in ThemeProvider** for dark mode support
2. **Add Toaster component** at root level if using toasts
3. **Use FormField** for controlled form inputs
4. **Provide unique IDs** for inputs with error messages
5. **Use semantic HTML** with Card sub-components
6. **Test keyboard navigation** for accessibility
7. **Provide ARIA labels** for icon-only buttons

## 🐛 Common Issues

**Styles not appearing?**
- Ensure Tailwind config includes UI package content
- Check ThemeProvider is wrapping your app

**TypeScript errors?**
- Update TypeScript to 5.0+
- Check peer dependencies are installed

**Dark mode not working?**
- Verify ThemeProvider has `attribute="class"`
- Check Tailwind has `darkMode: 'class'`

## 📦 Bundle Size

- ESM: ~38KB (minified)
- CJS: ~45KB (minified)
- Tree-shakeable - only import what you use!

## ✨ Component Checklist

When using components, ensure:
- [ ] ThemeProvider wraps app (for dark mode)
- [ ] Toaster added to root (if using toasts)
- [ ] Tailwind configured correctly
- [ ] Proper TypeScript types imported
- [ ] Accessibility attributes present
- [ ] Error states handled
- [ ] Loading states implemented
- [ ] Responsive design tested

---

**Need help?** Check the full documentation files or run Storybook for interactive examples!
