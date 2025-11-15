# @lms/ui

A comprehensive UI component library built with Radix UI primitives, React, and Tailwind CSS.

## Features

- 🎨 **Beautiful Components**: Built with Radix UI primitives
- 🌗 **Dark Mode**: Full dark mode support with next-themes
- ♿ **Accessible**: WCAG compliant with proper ARIA attributes
- 📱 **Responsive**: Mobile-first design
- 🎭 **TypeScript**: Fully typed for better DX
- 📖 **Documented**: Comprehensive Storybook documentation
- 🎯 **Form Validation**: React Hook Form + Zod integration

## Components

### Core Components
- **Button**: Multiple variants (default, destructive, outline, secondary, ghost, link) with loading states
- **Input**: Text input with error states and icon support
- **Select/Dropdown**: Accessible select component with groups and search
- **Card**: Container component with header, content, and footer sections
- **Dialog/Modal**: Accessible modal dialogs with animations
- **Label**: Form labels with proper accessibility

### Data Display
- **Table**: Sortable and paginated tables with responsive design
- **Progress**: Linear and circular progress indicators
- **Skeleton**: Loading placeholders for better perceived performance

### Feedback
- **Toast**: Non-intrusive notifications with action support
- **Spinner**: Loading spinners in multiple sizes

### Forms
- **Form Components**: React Hook Form integration with Zod validation
- **FormField**: Controlled form fields with error handling
- **FormLabel**: Accessible labels
- **FormMessage**: Error message display

## Installation

```bash
npm install @lms/ui
```

### Peer Dependencies

```bash
npm install react react-dom
```

## Usage

### Basic Example

```tsx
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from '@lms/ui';

function App() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
      </CardHeader>
      <CardContent>
        <Input placeholder="Email" type="email" />
        <Button className="mt-4">Sign In</Button>
      </CardContent>
    </Card>
  );
}
```

### With Theme Provider

```tsx
import { ThemeProvider, Button } from '@lms/ui';

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Button>Click me</Button>
    </ThemeProvider>
  );
}
```

### Form with Validation

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, Input, Button } from '@lms/ui';

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

function LoginForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
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
import { Toaster, useToast, Button } from '@lms/ui';

function App() {
  const { toast } = useToast();

  return (
    <>
      <Button
        onClick={() => {
          toast({
            title: 'Success',
            description: 'Your changes have been saved.',
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

### Table with Sorting and Pagination

```tsx
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TablePagination } from '@lms/ui';

function DataTable({ data }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead 
              sortable 
              sortDirection={sortField === 'name' ? sortDirection : null}
              onSort={() => handleSort('name')}
            >
              Name
            </TableHead>
            <TableHead>Email</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.email}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        currentPage={currentPage}
        totalPages={10}
        pageSize={20}
        totalItems={200}
        onPageChange={setCurrentPage}
      />
    </>
  );
}
```

## Styling

This library uses Tailwind CSS for styling. Make sure you have Tailwind CSS configured in your project.

### Tailwind Configuration

Add the following to your `tailwind.config.js`:

```js
module.exports = {
  content: [
    './node_modules/@lms/ui/**/*.{js,ts,jsx,tsx}',
    // ... your other paths
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // Custom theme extensions
    },
  },
};
```

## Development

### Running Storybook

```bash
npm run storybook
```

### Building

```bash
npm run build
```

### Development Mode

```bash
npm run dev
```

## Accessibility

All components are built with accessibility in mind:

- Proper ARIA attributes
- Keyboard navigation support
- Screen reader friendly
- Focus management
- Semantic HTML

## License

MIT
