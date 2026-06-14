import { LucideIcon } from "lucide-react";

interface DashboardHeadingProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
}

export const DashboardHeading = ({
  title,
  description,
  icon: Icon,
}: DashboardHeadingProps) => {
  return (
    <div className="mb-4">
      <h1 className="flex items-center text-2xl font-fontMontserrat font-medium tracking-wide text-foreground">
        {Icon && <Icon className="mr-2 inline-block h-6 w-6" />}
        {title}
      </h1>
      {description && (
        <p className="pt-2 font-fontUrbanist text-base text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
};
