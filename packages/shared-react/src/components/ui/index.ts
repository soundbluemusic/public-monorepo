/**
 * UI Components (shadcn/ui style)
 *
 * Radix UI + Tailwind + class-variance-authority 기반 컴포넌트
 * WCAG 2.1 접근성 준수
 */

// Core UI Components
export { Button, type ButtonProps, buttonVariants } from './button';
export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from './dialog';
// Form Components (Zod + React Hook Form)
export {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
  useFormField,
  z,
  zodResolver,
} from './form';
export { Input, type InputProps } from './input';
export { Label } from './label';

// Animation Components (Framer Motion)
export {
  AnimatePresence,
  FadeIn,
  motion,
  Pressable,
  ScaleIn,
  SlideUp,
  Stagger,
  StaggerItem,
} from './motion';

// Performance Components
export { useVirtualizer, VirtualList, type VirtualListProps } from './virtual-list';
