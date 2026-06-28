import React from "react";
import { Breadcrumb } from "antd";
import { Link } from "react-router-dom";
import { HomeOutlined } from "@ant-design/icons";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageLayoutProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  children?: React.ReactNode;
}

const PageLayout = ({
  title,
  subtitle,
  breadcrumbs = [],
  actions,
  children,
}: PageLayoutProps) => {
  const crumbItems = [
    {
      title: (
        <Link to="/" className="flex items-center gap-1 !text-gray-400 hover:!text-gray-600">
          <HomeOutlined style={{ fontSize: 12 }} />
        </Link>
      ),
    },
    ...breadcrumbs.map((crumb) => ({
      title: crumb.href ? (
        <Link to={crumb.href} className="!text-gray-400 hover:!text-gray-600 text-[11px]">
          {crumb.label}
        </Link>
      ) : (
        <span className="text-[11px] text-gray-600 font-medium">{crumb.label}</span>
      ),
    })),
  ];

  return (
    <div className="flex flex-col min-h-full">
      <div
        className="px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-gray-200"
        style={{ background: "#ffffff" }}
      >
        <div className="flex flex-col gap-0.5 min-w-0">
          <Breadcrumb items={crumbItems} className="leading-none" />
          <h1 className="text-sm font-bold text-gray-800 leading-tight mt-0.5 truncate">
            {title}
          </h1>
          {subtitle && (
            <p className="text-[10px] text-gray-400 leading-none">{subtitle}</p>
          )}
        </div>

        {actions && (
          <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
            {actions}
          </div>
        )}
      </div>

      {children !== undefined && (
        <div className="flex-1 p-4">{children}</div>
      )}
    </div>
  );
};

export default PageLayout;
