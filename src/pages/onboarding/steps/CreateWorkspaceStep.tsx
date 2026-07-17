import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, ArrowRight, Upload } from "lucide-react";
import { Input } from "../../../components/ui/forms/Input";
import { Button } from "../../../components/ui/Button";
import type { OnboardingData } from "../../../types";

const schema = z.object({
  name: z.string().min(2, "Workspace name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  industry: z.string().optional(),
  teamSize: z.string().optional(),
  color: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  onNext: () => void;
  onBack: () => void;
  updateData: (data: Partial<OnboardingData>) => void;
  data: OnboardingData;
}

export const CreateWorkspaceStep = ({ onNext, onBack, updateData, data }: Props) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: data,
  });

  const name = watch("name");
  
  // Auto-generate slug from name
  useEffect(() => {
    if (name && !data.slug) {
      const generatedSlug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setValue("slug", generatedSlug);
    }
  }, [name, setValue, data.slug]);

  const onSubmit = (values: FormValues) => {
    updateData({ ...data, ...values });
    onNext();
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold font-heading mb-2 text-text-primary">Let's set up your workspace</h2>
        <p className="text-text-secondary">Tell us a bit about your organization.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        {/* Logo Upload Placeholder */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-surface-hover border border-surface-border flex items-center justify-center text-text-muted hover:bg-surface hover:text-text-primary transition-colors cursor-pointer border-dashed">
            <Upload className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-medium text-text-primary">Workspace Logo</div>
            <div className="text-xs text-text-muted">Recommended: 256x256px or larger</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Workspace Name"
            placeholder="Acme Corp"
            error={errors.name?.message}
            {...register("name")}
            autoFocus
          />
          <Input
            label="Workspace URL"
            placeholder="acme-corp"
            error={errors.slug?.message}
            {...register("slug")}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-primary ml-1">Industry</label>
            <select
              className="flex h-11 w-full rounded-xl border border-surface-border bg-surface-hover px-3 py-2 text-sm text-text-primary placeholder:text-text-muted transition-all focus:outline-none focus:ring-2 focus:ring-brand-indigo/50 focus:border-brand-indigo focus:bg-surface"
              {...register("industry")}
            >
              <option value="" className="bg-surface">Select industry</option>
              <option value="tech" className="bg-surface">Technology</option>
              <option value="agency" className="bg-surface">Agency / Consulting</option>
              <option value="ecommerce" className="bg-surface">E-commerce</option>
              <option value="other" className="bg-surface">Other</option>
            </select>
          </div>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-primary ml-1">Team Size</label>
            <select
              className="flex h-11 w-full rounded-xl border border-surface-border bg-surface-hover px-3 py-2 text-sm text-text-primary placeholder:text-text-muted transition-all focus:outline-none focus:ring-2 focus:ring-brand-indigo/50 focus:border-brand-indigo focus:bg-surface"
              {...register("teamSize")}
            >
              <option value="" className="bg-surface">Select size</option>
              <option value="1-10" className="bg-surface">1-10</option>
              <option value="11-50" className="bg-surface">11-50</option>
              <option value="51-200" className="bg-surface">51-200</option>
              <option value="200+" className="bg-surface">200+</option>
            </select>
          </div>
        </div>

        <div className="pt-4 flex items-center justify-between border-t border-surface-border">
          <button
            type="button"
            onClick={onBack}
            className="text-sm font-medium text-text-muted hover:text-text-primary transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          
          <Button type="submit">
            Continue <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </form>
    </div>
  );
};
