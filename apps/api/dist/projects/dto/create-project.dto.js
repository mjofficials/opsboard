var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class CreateProjectDto {
    name;
    description;
    status;
    organization_id;
    assignee_id;
}
__decorate([
    ApiProperty({ example: 'New Website Launch' }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "name", void 0);
__decorate([
    ApiPropertyOptional({ example: 'Redesigning the corporate website.' }),
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "description", void 0);
__decorate([
    ApiProperty({ example: 'ACTIVE', enum: ['ACTIVE', 'INACTIVE'] }),
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "status", void 0);
__decorate([
    ApiProperty({ example: 'uuid-org-id' }),
    IsUUID(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "organization_id", void 0);
__decorate([
    ApiPropertyOptional({ example: 'uuid-user-id' }),
    IsUUID(),
    IsOptional(),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "assignee_id", void 0);
//# sourceMappingURL=create-project.dto.js.map