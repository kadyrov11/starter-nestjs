import {applyDecorators, UseGuards} from '@nestjs/common'
import { TypeRole } from "../auth.interface"
import { JwtAuthGuard } from '../guards/jwt.guards'
import { IsAdminGuard } from '../guards/admin.guard'


export const Auth = (role: TypeRole = 'user') => applyDecorators(
    role === 'admin' ?  UseGuards(JwtAuthGuard, IsAdminGuard) : UseGuards(JwtAuthGuard)
    )
