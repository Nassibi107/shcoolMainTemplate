'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import type { Student } from '@/hooks/useStudents';

const studentSchema = z.object({
  firstName:   z.string().min(2, 'First name required'),
  lastName:    z.string().min(2, 'Last name required'),
  email:       z.string().email('Valid email required').optional().or(z.literal('')),
  password:    z.string().min(8).optional().or(z.literal('')),
  phone:       z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender:      z.enum(['MALE', 'FEMALE', 'OTHER', '']).optional(),
  address:     z.string().optional(),
});

export type StudentFormValues = z.infer<typeof studentSchema>;

interface StudentFormProps {
  onSubmit: (values: StudentFormValues) => Promise<void>;
  defaultValues?: Partial<StudentFormValues>;
  isEditing?: boolean;
}

export function StudentForm({ onSubmit, defaultValues, isEditing = false }: StudentFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: defaultValues ?? {},
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="First Name"
          placeholder="Ahmed"
          error={errors.firstName?.message}
          {...register('firstName')}
        />
        <Input
          label="Last Name"
          placeholder="Hassan"
          error={errors.lastName?.message}
          {...register('lastName')}
        />
      </div>

      {!isEditing && (
        <>
          <Input
            label="Email"
            type="email"
            placeholder="student@school.io"
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label="Password"
            type="password"
            placeholder="Min. 8 characters"
            error={errors.password?.message}
            {...register('password')}
          />
        </>
      )}

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Phone"
          type="tel"
          placeholder="+1 234 567 890"
          {...register('phone')}
        />
        <Input
          label="Date of Birth"
          type="date"
          {...register('dateOfBirth')}
        />
      </div>

      <Select
        label="Gender"
        options={[
          { value: 'MALE', label: 'Male' },
          { value: 'FEMALE', label: 'Female' },
          { value: 'OTHER', label: 'Other' },
        ]}
        placeholder="Select gender"
        {...register('gender')}
      />

      <Input
        label="Address"
        placeholder="123 Main St, City"
        {...register('address')}
      />

      <div className="flex gap-3 pt-2 justify-end">
        <Button type="submit" isLoading={isSubmitting}>
          {isEditing ? 'Update Student' : 'Enroll Student'}
        </Button>
      </div>
    </form>
  );
}
