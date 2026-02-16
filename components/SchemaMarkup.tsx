import SchemaMarkupComponent, { SchemaType, BreadcrumbItem } from '@/lib/schema-markup';

interface SchemaMarkupProps {
  type: SchemaType | SchemaType[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  breadcrumbs?: BreadcrumbItem[];
}

export default function SchemaMarkup({ type, data, breadcrumbs }: SchemaMarkupProps) {
  return <SchemaMarkupComponent type={type} data={data} breadcrumbs={breadcrumbs} />;
}


