import React, { useState } from 'react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  eachDayOfInterval,
  parseISO
} from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TaskCalendar = ({ data }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const renderHeader = () => {
    return (
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Task Calendar</h1>
          <p style={{ color: 'var(--text-secondary)' }}>View and manage your tasks across the month.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button 
            onClick={() => {
              setCurrentMonth(new Date());
              setSelectedDate(new Date());
            }}
            className="btn-secondary"
            style={{ padding: '8px 16px', fontSize: '14px' }}
          >
            Today
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'var(--bg-secondary)', padding: '8px 16px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
            <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="transition-all" style={{ color: 'var(--text-secondary)' }}>
              <ChevronLeft size={20} />
            </button>
            <span style={{ fontSize: '16px', fontWeight: '600', minWidth: '140px', textAlign: 'center' }}>
              {format(currentMonth, 'MMMM yyyy')}
            </span>
            <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="transition-all" style={{ color: 'var(--text-secondary)' }}>
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </header>
    );
  };

  const renderDays = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: '12px' }}>
        {days.map(day => (
          <div key={day} style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const calendarDays = eachDayOfInterval({
      start: startDate,
      end: endDate,
    });

    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
        {calendarDays.map((day, idx) => {
          const formattedDate = format(day, 'd');
          const tasksForDay = data.tasks.filter(task => isSameDay(parseISO(task.deadline), day));
          const isSelected = isSameDay(day, selectedDate);
          const isCurrentMonth = isSameMonth(day, monthStart);
          const isToday = isSameDay(day, new Date());

          return (
            <motion.div
              key={day.toString()}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedDate(day)}
              className="glass"
              style={{
                height: '110px',
                padding: '12px',
                borderRadius: '16px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                opacity: isCurrentMonth ? 1 : 0.3,
                border: isSelected ? '1px solid var(--accent-primary)' : isToday ? '1px solid var(--accent-secondary)' : '1px solid var(--glass-border)',
                background: isSelected ? 'var(--bg-accent)' : isToday ? 'rgba(59, 130, 246, 0.05)' : 'var(--glass-bg)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{ 
                fontSize: '14px', 
                fontWeight: isToday ? '700' : '500',
                color: isToday ? 'var(--accent-secondary)' : isSelected ? 'var(--accent-primary)' : 'var(--text-primary)'
              }}>
                {formattedDate}
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', overflow: 'hidden' }}>
                {tasksForDay.slice(0, 2).map(task => (
                  <div 
                    key={task.id} 
                    style={{ 
                      fontSize: '10px', 
                      padding: '4px 8px', 
                      borderRadius: '4px', 
                      background: task.status === 'completed' ? 'var(--accent-success)' : task.priority === 'High' ? 'var(--accent-danger)' : 'var(--accent-primary)',
                      color: 'white',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      opacity: task.status === 'completed' ? 0.6 : 1
                    }}
                  >
                    {task.name}
                  </div>
                ))}
                {tasksForDay.length > 2 && (
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', textAlign: 'center' }}>
                    + {tasksForDay.length - 2} more
                  </div>
                )}
              </div>

              {isToday && (
                <div style={{ 
                  position: 'absolute', 
                  bottom: '8px', 
                  right: '8px', 
                  width: '6px', 
                  height: '6px', 
                  borderRadius: '50%', 
                  background: 'var(--accent-secondary)',
                  boxShadow: '0 0 10px var(--accent-secondary)'
                }} />
              )}
            </motion.div>
          );
        })}
      </div>
    );
  };

  const selectedDayTasks = data.tasks.filter(task => isSameDay(parseISO(task.deadline), selectedDate));

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      {renderHeader()}
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '32px' }}>
        <div>
          {renderDays()}
          {renderCells()}
        </div>

        <div className="glass" style={{ borderRadius: '24px', padding: '24px', height: 'fit-content', border: '1px solid var(--glass-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <CalendarIcon size={20} color="var(--accent-primary)" />
            <h3 style={{ fontSize: '18px' }}>{format(selectedDate, 'do MMMM')}</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {selectedDayTasks.length > 0 ? (
              selectedDayTasks.map(task => (
                <div key={task.id} style={{ 
                  padding: '12px', 
                  borderRadius: '12px', 
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  opacity: task.status === 'completed' ? 0.7 : 1
                }}>
                  <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '6px', textDecoration: task.status === 'completed' ? 'line-through' : 'none' }}>
                    {task.name}
                  </div>
                  <div style={{ display: 'flex', gap: '12px', fontSize: '11px', color: 'var(--text-secondary)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} /> {task.deadline}
                    </span>
                    <span style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '4px',
                      color: task.priority === 'High' ? 'var(--accent-danger)' : task.priority === 'Medium' ? 'var(--accent-warning)' : 'var(--accent-success)'
                    }}>
                      <AlertTriangle size={12} /> {task.priority}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                <CalendarIcon size={32} style={{ marginBottom: '12px', opacity: 0.2 }} />
                <p style={{ fontSize: '14px' }}>No tasks scheduled for this day.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCalendar;
