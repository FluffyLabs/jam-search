import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  CheckIcon,
  XCircle,
  ChevronDown,
  XIcon,
  WandSparkles,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { isArray } from "lodash";

/**
 * Variants for the multi-select component to handle different styles.
 * Uses class-variance-authority (cva) to define different styles based on "variant" prop.
 */
const multiSelectVariants = cva(
  "transition ease-in-out delay-150 duration-300",
  {
    variants: {
      variant: {
        default:
          "border-foreground/10 text-foreground bg-card hover:bg-card/80",
        primary: "border-primary bg-[#242424] text-primary-foreground",
        secondary:
          "border-foreground/10 bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
);

/**
 * Props for MultiSelect component
 */
interface MultiSelectProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof multiSelectVariants> {
  /**
   * An array of option objects to be displayed in the multi-select component.
   * Each option object has a label, value, and an optional icon.
   */
  options: {
    /** The text to display for the option. */
    label: string;
    /** The unique value associated with the option. */
    value: string;
    /** Optional icon component to display alongside the option. */
    icon?: React.ComponentType<{ className?: string }>;
    /** Optional removable flag. */
    removable?: boolean;
    /** If true, the option will be disabled and cannot be selected. */
    disabled?: boolean;
  }[];

  /**
   * Callback function triggered when the selected values change.
   * Receives an array of the new selected values.
   */
  onValueChange: (value: string[]) => void;

  /** The default selected values when the component mounts. */
  selectedValues?: string[];

  /**
   * Placeholder text to be displayed when no values are selected.
   * Optional, defaults to "Select options".
   */
  placeholder?: string;

  /**
   * Animation duration in seconds for the visual effects (e.g., bouncing badges).
   * Optional, defaults to 0 (no animation).
   */
  animation?: number;

  /**
   * Maximum number of items to display. Extra selected items will be summarized.
   * Optional, defaults to 3.
   */
  maxCount?: number;

  /**
   * The modality of the popover. When set to true, interaction with outside elements
   * will be disabled and only popover content will be visible to screen readers.
   * Optional, defaults to false.
   */
  modalPopover?: boolean;

  /**
   * If true, renders the multi-select component as a child of another component.
   * Optional, defaults to false.
   */
  asChild?: boolean;

  /**
   * Additional class names to apply custom styles to the multi-select component.
   * Optional, can be used to add custom styles.
   */
  className?: string;

  /**
   * (Custom)
   */
  showSelectAll?: boolean;

  /**
   * (Custom)
   */
  showSearch?: boolean;

  /**
   * (Custom)
   */
  showClearAll?: boolean;

  /**
   * (Custom)
   */
  showOptionsAsTags?: boolean;

  /**
   * (Custom)
   */
  required?: boolean;

  /**
   * (Custom)
   */
  children?: React.ReactNode;

  /**
   * (Custom)
   */
  removeOption?: (value: string) => void;
}

export const MultiSelect = React.forwardRef<
  HTMLButtonElement,
  MultiSelectProps
>(
  (
    {
      options,
      onValueChange,
      variant,
      selectedValues = [],
      placeholder = "Select options",
      animation = 0,
      maxCount = 3,
      modalPopover = false,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      asChild = false,
      className,
      showSelectAll,
      showSearch,
      showClearAll,
      showOptionsAsTags,
      required,
      children,
      removeOption,
      ...props
    },
    ref
  ) => {
    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
    const [isAnimating, setIsAnimating] = React.useState(false);

    const handleInputKeyDown = (
      event: React.KeyboardEvent<HTMLInputElement>
    ) => {
      if (event.key === "Enter") {
        setIsPopoverOpen(true);
      } else if (event.key === "Backspace" && !event.currentTarget.value) {
        const newSelectedValues = [...selectedValues];
        newSelectedValues.pop();
        onValueChange(newSelectedValues);
      }
    };

    const toggleOption = (option: string) => {
      // Check if the option is disabled before toggling
      const optionObj = options.find((o) => o.value === option);
      if (optionObj?.disabled) return;

      const newSelectedValues = selectedValues.includes(option)
        ? selectedValues.filter((value) => value !== option)
        : [...selectedValues, option];
      onValueChange(newSelectedValues);
    };

    const handleClear = () => {
      onValueChange([]);
    };

    const handleTogglePopover = () => {
      setIsPopoverOpen((prev) => !prev);
    };

    const clearExtraOptions = () => {
      const newSelectedValues = selectedValues.slice(0, maxCount);
      onValueChange(newSelectedValues);
    };

    const toggleAll = () => {
      if (selectedValues.length === options.length) {
        handleClear();
      } else {
        const allValues = options.map((option) => option.value);
        onValueChange(allValues);
      }
    };

    return (
      <Popover
        open={isPopoverOpen}
        onOpenChange={setIsPopoverOpen}
        modal={modalPopover}
      >
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            {...props}
            onClick={handleTogglePopover}
            className={cn(
              "flex w-full p-1 rounded-md border min-h-10 h-auto items-center justify-between bg-inherit hover:bg-inherit text-xs",
              required && !selectedValues.length ? "border-destructive" : "",
              className
            )}
          >
            {selectedValues.length > 0 ? (
              <div className="flex justify-between items-center w-full">
                <div className="w-0 flex-1 overflow-hidden">
                  <div className="flex flex-wrap items-center truncate">
                    {!showOptionsAsTags &&
                      selectedValues.length <= maxCount &&
                      selectedValues.slice(0, maxCount).map((value) => {
                        const option = options.find((o) => o.value === value);
                        return (
                          <span key={value} className="text-[#858585] px-2">
                            {option?.label}
                          </span>
                        );
                      })}
                    {!showOptionsAsTags && selectedValues.length > maxCount && (
                      <span className="text-[#858585] px-2">
                        <span className="hidden md:inline">Sources</span>{" "}
                        <span className="bg-secondary ml-1 p-1 rounded-xl w-[15px] h-[15px]">
                          {selectedValues.length}
                        </span>
                      </span>
                    )}
                    {showOptionsAsTags &&
                      selectedValues.slice(0, maxCount).map((value) => {
                        const option = options.find((o) => o.value === value);
                        const IconComponent = option?.icon;
                        return (
                          <Badge
                            key={value}
                            className={cn(
                              isAnimating ? "animate-bounce" : "",
                              multiSelectVariants({ variant })
                            )}
                            style={{ animationDuration: `${animation}s` }}
                          >
                            {IconComponent && (
                              <IconComponent className="h-4 w-4 mr-2" />
                            )}
                            {option?.label}
                            <XCircle
                              className="ml-2 h-4 w-4 cursor-pointer"
                              onClick={(event) => {
                                event.stopPropagation();
                                toggleOption(value);
                              }}
                            />
                          </Badge>
                        );
                      })}
                    {showOptionsAsTags && selectedValues.length > maxCount && (
                      <Badge
                        className={cn(
                          "bg-transparent text-foreground border-foreground/1 hover:bg-transparent",
                          isAnimating ? "animate-bounce" : "",
                          multiSelectVariants({ variant })
                        )}
                        style={{ animationDuration: `${animation}s` }}
                      >
                        {`+ ${selectedValues.length - maxCount} more`}
                        <XCircle
                          className="ml-2 h-4 w-4 cursor-pointer"
                          onClick={(event) => {
                            event.stopPropagation();
                            clearExtraOptions();
                          }}
                        />
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  {showClearAll && (
                    <XIcon
                      className="h-4 cursor-pointer text-muted-foreground"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleClear();
                      }}
                    />
                  )}
                  <ChevronDown className="h-4 cursor-pointer text-muted-foreground" />
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between w-full mx-auto">
                <span className="text-sm text-muted-foreground mx-3">
                  {placeholder}
                </span>
                <ChevronDown className="h-4 cursor-pointer text-muted-foreground mx-2" />
              </div>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-2 bg-[#242424] border-[#444444] rounded-lg"
          align="start"
          onEscapeKeyDown={() => setIsPopoverOpen(false)}
        >
          <Command className="bg-transparent">
            {showSearch && (
              <CommandInput
                placeholder="Search..."
                onKeyDown={handleInputKeyDown}
              />
            )}
            <CommandList
              className={cn("bg-gray-900", multiSelectVariants({ variant }))}
            >
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {showSelectAll && (
                  <CommandItem
                    key="all"
                    onSelect={toggleAll}
                    className="cursor-pointer"
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm",
                        selectedValues.length === options.length
                          ? "bg-[#242424] text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      <CheckIcon className="h-3 w-3" />
                    </div>
                    <span>(Select All)</span>
                  </CommandItem>
                )}
                {options.map((option) => {
                  const isSelected = selectedValues.includes(option.value);
                  return (
                    <CommandItem
                      key={option.value}
                      onSelect={() => toggleOption(option.value)}
                      className={cn(
                        "cursor-pointer",
                        isSelected ? "text-white" : "text-[rgb(204,204,204)]",
                        option.disabled &&
                          "opacity-50 cursor-not-allowed pointer-events-none"
                      )}
                    >
                      <div
                        className={cn(
                          "mr-2 flex h-4 w-4 p-0.5 items-center justify-center rounded-sm border border-[#3B4040] bg-[#323232]",
                          isSelected
                            ? "bg-brand text-[#1C1B1F] border-brand"
                            : "opacity-50 [&_svg]:invisible"
                        )}
                      >
                        <CheckIcon className="h-3 w-3" />
                      </div>
                      {option.icon && (
                        <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="flex-1 text-[11px]">{option.label}</span>
                      {option.removable && !option.disabled && (
                        <XCircle
                          className="ml-2 h-4 w-4 cursor-pointer"
                          onClick={(event) => {
                            event.stopPropagation();
                            toggleOption(option.value);
                            removeOption?.(option.value);
                          }}
                        />
                      )}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
              {showClearAll && (
                <>
                  <CommandSeparator />
                  <CommandGroup>
                    <div className="flex items-center justify-between">
                      {selectedValues.length > 0 && (
                        <>
                          <CommandItem
                            onSelect={handleClear}
                            className="flex-1 justify-center cursor-pointer"
                          >
                            Clear
                          </CommandItem>
                          <Separator
                            orientation="vertical"
                            className="flex min-h-6 h-full"
                          />
                        </>
                      )}
                      <CommandItem
                        onSelect={() => setIsPopoverOpen(false)}
                        className="flex-1 justify-center cursor-pointer max-w-full"
                      >
                        Close
                      </CommandItem>
                    </div>
                  </CommandGroup>
                </>
              )}
              {children && (
                <>
                  <CommandSeparator className="bg-secondary-foreground mt-2" />
                  <CommandGroup>
                    {isArray(children) ? (
                      children.map((child, id) => (
                        <CommandItem key={id}>{child}</CommandItem>
                      ))
                    ) : (
                      <CommandItem>{children}</CommandItem>
                    )}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
        {animation > 0 && selectedValues.length > 0 && (
          <WandSparkles
            className={cn(
              "cursor-pointer my-2 text-foreground bg-background w-3 h-3",
              isAnimating ? "" : "text-muted-foreground"
            )}
            onClick={() => setIsAnimating(!isAnimating)}
          />
        )}
      </Popover>
    );
  }
);

MultiSelect.displayName = "MultiSelect";
