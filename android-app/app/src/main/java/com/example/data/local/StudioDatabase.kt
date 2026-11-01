package com.example.data.local

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.sqlite.db.SupportSQLiteDatabase
import com.example.data.model.BookingEntity
import com.example.data.model.ClientEntity
import com.example.data.model.NotificationEntity
import com.example.data.model.TeamMemberEntity
import com.example.data.model.TransactionEntity
import com.example.data.model.UsbDeliveryEntity
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

@Database(
    entities = [
        ClientEntity::class,
        BookingEntity::class,
        TransactionEntity::class,
        UsbDeliveryEntity::class,
        TeamMemberEntity::class,
        NotificationEntity::class
    ],
    version = 2,
    exportSchema = false
)
abstract class StudioDatabase : RoomDatabase() {
    abstract fun clientDao(): ClientDao
    abstract fun bookingDao(): BookingDao
    abstract fun transactionDao(): TransactionDao
    abstract fun usbDeliveryDao(): UsbDeliveryDao
    abstract fun teamDao(): TeamDao
    abstract fun notificationDao(): NotificationDao

    companion object {
        @Volatile
        private var INSTANCE: StudioDatabase? = null

        fun getInstance(context: Context): StudioDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    StudioDatabase::class.java,
                    "ibra_production_studio.db"
                ).fallbackToDestructiveMigration()
                .addCallback(object : Callback() {
                    override fun onCreate(db: SupportSQLiteDatabase) {
                        super.onCreate(db)
                        CoroutineScope(Dispatchers.IO).launch {
                            val database = getInstance(context)
                            database.clientDao().insertClients(StudioSeedData.initialClients)
                            database.bookingDao().insertBookings(StudioSeedData.initialBookings)
                            database.transactionDao().insertTransactions(StudioSeedData.initialTransactions)
                            database.usbDeliveryDao().insertUsbDeliveries(StudioSeedData.initialUsbDeliveries)
                            database.teamDao().insertTeamMembers(StudioSeedData.initialTeam)
                            database.notificationDao().insertNotifications(StudioSeedData.initialNotifications)
                        }
                    }
                }).build()
                INSTANCE = instance
                instance
            }
        }
    }
}
