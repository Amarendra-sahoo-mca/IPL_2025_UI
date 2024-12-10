import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

import { UserTypes } from "src/enums/user.enum";
import * as crypto from 'crypto';
import { getMetadataArgsStorage } from 'typeorm';


interface PaginationData {
    take: number;
    skip: number;
}

interface Entity {
    // Add any other properties you might expect from your entity classes
    new(): any; // This ensures the entity can be instantiated
}

interface ApplySortingParams {
    entity: any; // Main entity (e.g., SubDistrictEntity, BlockEntity, etc.)
    sortBy?: string; // Sort column passed by the user (e.g., 'subdistrict_name', 'dist_name', etc.)
    sortOrder?: string; // Sort order passed by the user ('ASC' or 'DESC')
    relations?: { [key: string]: string }; // Relation alias to the entity columns (e.g., { dist_name: 'district.name' })
    alias: string; // Query builder alias for the main entity
}

// export function formatDate(data:any){ return moment(data).format("DD/MM/YYYY"); }

export const getUserTypeName = (type: number): string => {
    switch (type) {
        case UserTypes.ADMIN:
            return 'Admin';
        case UserTypes.EMPLOYEE:
            return 'Employee';
        case UserTypes.AGENT:
            return 'Agent';
        default:
            return 'Unknown';
    }
}

export const generatePassword = (length = 10) => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+={}<>?";
    let password = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    return password;
};


export class CreatedBy {
    @ApiProperty({
        description: `created_by`,
    })
    created_by: number;
}
export class email {
    @ApiProperty({
        description: `email`,
    })
    email: string;
}






export const generateOtp = (): string => {
    return crypto.randomBytes(3).toString('hex').toUpperCase(); // 6-character OTP
}

export const applyPagination = (page: string | number = 1): PaginationData => {
    let currentPage = Number(page);

    // Check if currentPage is NaN or less than 1
    if (isNaN(currentPage) || currentPage <= 0) {
        currentPage = 1;
    }

    const take = 100; // Number of records to fetch (like limit)
    const skip = (currentPage - 1) * take; // Number of records to skip (like offset)

    return {
        take,
        skip
    };
};

export const applySorting = <T extends Entity>(
    sortBy: string | undefined,
    sortOrder: string | undefined,
    entity: T
): { [key: string]: 'ASC' | 'DESC' } => {
    const order: { [key: string]: 'ASC' | 'DESC' } = {};

    // Get all columns from TypeORM metadata
    const metadata = getMetadataArgsStorage();
    const columns = metadata.columns
        .filter(column => column.target === entity)
        .map(column => column.propertyName);

    // console.log('Available columns:', columns);

    if (sortBy && columns.includes(sortBy)) {
        order[sortBy] = sortOrder?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    } else {
        // console.warn(`Invalid sortBy field: ${sortBy}, defaulting to no sorting.`);
    }

    return order;
};

export const applySortingJoin = ({
    entity,
    sortBy,
    sortOrder,
    relations = {},
    alias, // Add alias parameter
}: ApplySortingParams) => {
    // Get all columns from TypeORM metadata for the main entity
    const metadata = getMetadataArgsStorage();
    const entityColumns = metadata.columns
        .filter(column => column.target === entity)
        .map(column => column.propertyName);

    let sortField: string = `${alias}.id`; // Use alias for default sorting

    if (sortBy && entityColumns.includes(sortBy)) {
        // If the sortBy exists in the main entity
        sortField = `${alias}.${sortBy}`; // Use the provided alias
    } else if (sortBy && relations[sortBy]) {
        // If the sortBy matches a relation alias (like 'dist_name')
        sortField = relations[sortBy]; // Use the relation column (e.g., 'district.name')
    }

    // Default sortOrder to 'ASC' if invalid or not provided
    const validSortOrder: "ASC" | "DESC" = sortOrder?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    return {
        sortField,
        sortOrder: validSortOrder,
    };
};
