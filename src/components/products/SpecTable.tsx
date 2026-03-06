import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Minus, Plus } from "lucide-react";

export interface ProductSpec {
  name?: string;
  depth?: number | string;
  width?: number | string;
  height?: number | string;
  price?: number | string;
  stock?: number | string;
  sku?: string;
  quantity?: number;
}

interface SpecTableProps {
  specs: ProductSpec[];
  onQuantityChange: (index: number, delta: number) => void;
}

const SpecTable = ({ specs, onQuantityChange }: SpecTableProps) => {
  return (
    <div className="rounded-lg overflow-hidden border border-border">
      <Table>
        <TableHeader>
          <TableRow className="bg-primary hover:bg-primary">
            <TableHead className="text-primary-foreground font-semibold">Product Name</TableHead>
            <TableHead className="text-primary-foreground font-semibold text-center">Depth</TableHead>
            <TableHead className="text-primary-foreground font-semibold text-center">Width</TableHead>
            <TableHead className="text-primary-foreground font-semibold text-center">Height</TableHead>
            <TableHead className="text-primary-foreground font-semibold text-center">Stock</TableHead>
            <TableHead className="text-primary-foreground font-semibold text-center">Price</TableHead>
            <TableHead className="text-primary-foreground font-semibold text-center">Quantity</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {specs.map((spec, index) => (
            <TableRow key={index} className="hover:bg-muted/50">
              <TableCell className="font-medium text-sm">{spec.name}</TableCell>
              <TableCell className="text-center text-sm">{spec.depth}</TableCell>
              <TableCell className="text-center text-sm">{spec.width}</TableCell>
              <TableCell className="text-center text-sm">{spec.height}</TableCell>
              <TableCell className="text-center text-sm">{spec.stock}</TableCell>
              <TableCell className="text-center text-sm">{spec.price}</TableCell>
              <TableCell>
                <div className="flex items-center justify-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => onQuantityChange(index, -1)}
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                  <span className="w-8 text-center text-sm">{spec.quantity}</span>
                  <Button
                    variant="default"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => onQuantityChange(index, 1)}
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SpecTable;
