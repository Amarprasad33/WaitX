// components/forms/signup-form.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { signupFormSchema, SignupSchemaType } from '@/lib/schema/authSchema';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';  
import { useRouter } from 'next/navigation';
import { MultiSelect } from '../ui/multi-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

type EV = {
    brand: string;
    model: string;
    battery_capacity_kWh: number;
}

export default function SignupForm() {
  const [passwordVisible, setPasswordVisible] = useState(false);
//   const { toast } = useToast();
  const router = useRouter();

  const [brands, setBrands] = useState<{ value: string; label: string }[]>([]);
  const [modelsByBrand, setModelsByBrand] = useState<{ [brand: string]: string[] }>({});
  const [models, setModels] = useState<{ value: string; label: string }[]>([]);

  const form = useForm<SignupSchemaType>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
        name: '',
        email: '',
        password: '',
        vehicleBrand: "",
        vehicleModel: "",
    },
  });

  useEffect(() => {
    async function fetchConfig () {
        const res = await fetch('/config/evModelData.json');
        const evData: EV[] = await res.json();
        console.log("Evdata--", evData);
        // Extract unique brands
        const uniqueBrands = Array.from(new Set(evData.map(ev => ev.brand)));

        // Extract all models
        const models: string[] = evData.map(ev => ev.model);

        const modelsByBrand: { [brand: string]: string[] } = evData.reduce((acc, ev) => {
            if (!acc[ev.brand]) {
              acc[ev.brand] = [];
            }
            acc[ev.brand].push(ev.model);
            return acc;
          }, {} as { [brand: string]: string[] });

        console.log("Brands", uniqueBrands);
        console.log("models--by-brand", modelsByBrand);

        // Brands as options
        setBrands(uniqueBrands.map(b => ({ value: b, label: b })));

        // Models by brand
        setModelsByBrand(modelsByBrand);
    }

    fetchConfig();
  }, [])

  useEffect(() => {
    const selectedBrand = form.watch("vehicleBrand"); // Assuming single select
    if (selectedBrand && modelsByBrand[selectedBrand]) {
      setModels(modelsByBrand[selectedBrand].map(m => ({ value: m, label: m })));
    } else {
      setModels([]);
    }
  }, [form.watch("vehicleBrand"), modelsByBrand]);

  useEffect(() => {
    console.log("models_by-brnad", modelsByBrand)
    console.log("brands=set", brands);
  }, [modelsByBrand, brands])

  const togglePassword = () => setPasswordVisible(!passwordVisible);

  async function onSubmit(data: SignupSchemaType) {
    try {
        console.log("submit-data", data);
      const response = await axios.post('http://ec2-35-154-166-146.ap-south-1.compute.amazonaws.com:8000/registerUser', data);

      if (response.status === 200) {
        toast("Signup successful. Welcome!")
        router.push('/');
      } else {
        throw new Error('Signup failed');
      }
    } catch (error: any) {
      toast("Signup failed", {
        description: error?.response?.data?.message || 'Something went wrong!',
        action: {
            label: "OK!",
            onClick: () => console.log("Undo"),
        },
      })

    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 items-center w-[85%]">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormDescription>Enter your full name</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="you@example.com" type="email" {...field} />
              </FormControl>
              <FormDescription>We'll never share your email.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="relative">
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type={passwordVisible ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...field}
                />
              </FormControl>
              <button
                type="button"
                onClick={togglePassword}
                className="absolute right-3 top-8 text-sm text-muted-foreground"
              >
                {passwordVisible ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
              </button>
              <FormDescription>
                Must be at least 8 characters
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />


        <FormField
            control={form.control}
            name="vehicleBrand"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vehicle brand</FormLabel>
                <FormControl>
                  <Select {...field} onValueChange={(e) => field.onChange(e)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select brand.." />
                    </SelectTrigger>
                    <SelectContent>
                        {brands.map((brand: any) => (
                            <SelectItem value={brand.value}>{brand.label}</SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
        />

        <FormField
            control={form.control}
            name="vehicleModel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vehicle model</FormLabel>
                <FormControl>
                  <Select {...field} onValueChange={(e) => field.onChange(e)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select brand.." />
                    </SelectTrigger>
                    <SelectContent>
                        {models.map((model: any) => (
                            <SelectItem value={model.value} onChange={(selectedValues) => { field.onChange(selectedValues); }}>{model.label}</SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
        />


        {/* // For multi-select \\
            <FormField
            control={form.control}
            name="vehicleModel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vehicle model</FormLabel>
                <FormControl>
                  <MultiSelect 
                    selected={field.value}
                    options={models}
                    onChange={(selectedValues) => { field.onChange(selectedValues); }}
                    placeholderText="model"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
        /> */}

        <Button type="submit" className="w-full">
          Sign Up
        </Button>
      </form>
    </Form>
  );
}
