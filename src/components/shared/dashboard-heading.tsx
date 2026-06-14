interface DashboardHeadingProps {
  title: string;
  description?: string;
}

export const DashboardHeading = ({
  title,
  description,
}: DashboardHeadingProps) => {
  return (
    <div className="mb-4">
      <h1 className="text-2xl font-fontMontserrat font-medium tracking-wide text-foreground">
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
